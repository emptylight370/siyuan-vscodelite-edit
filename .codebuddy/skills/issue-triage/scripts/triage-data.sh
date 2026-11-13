#!/bin/sh
# issue-triage data directory helper (POSIX sh, Unix/macOS).
# Commands: resolve | init | sync | status
# Exit codes: 0 success, 1 usage/runtime error, 2 sync conflicts reported.
set -u

SKILL_DEFAULT='issue-triage'
TAB=$(printf '\t')

# ------------------------------------------------------------------ helpers

exists() { [ -e "$1" ] || [ -L "$1" ]; }
is_dir() { [ -d "$1" ]; }
is_link() { [ -L "$1" ]; }

real_path() {
  p=$1
  if [ -d "$p" ]; then
    ( cd "$p" 2>/dev/null && pwd -P ) || printf '%s\n' "$p"
  else
    d=$(dirname "$p")
    b=$(basename "$p")
    if [ -d "$d" ]; then
      ( cd "$d" 2>/dev/null && printf '%s/%s\n' "$(pwd -P)" "$b" ) || printf '%s\n' "$p"
    else
      printf '%s\n' "$p"
    fi
  fi
}

link_target() {
  [ -L "$1" ] || return 1
  t=$(readlink "$1" 2>/dev/null) || return 1
  case $t in
    /*) ;;
    *) t=$(dirname "$1")/$t ;;
  esac
  real_path "$t"
}

skill_name() {
  file=$1/SKILL.md
  [ -f "$file" ] || return 1
  awk '
    NR == 1 {
      if ($0 ~ /^---\r?$/) { infm = 1; next } else { exit }
    }
    infm && $0 ~ /^---\r?$/ { exit }
    infm && $0 ~ /^[ \t]*name[ \t]*:/ {
      line = $0
      sub(/^[ \t]*name[ \t]*:[ \t]*/, "", line)
      sub(/[ \t\r]+$/, "", line)
      gsub(/^"|"$/, "", line)
      print line
      exit
    }
  ' "$file"
}

list_dirs() {
  root=$1
  for d in "$root"/* "$root"/.[!.]* "$root"/..?*; do
    exists "$d" || continue
    is_dir "$d" || continue
    printf '%s\n' "$(basename "$d")"
  done
}

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" 2>/dev/null | cut -d' ' -f1
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" 2>/dev/null | cut -d' ' -f1
  else
    wc -c < "$1" 2>/dev/null | tr -d ' '
  fi
}

json_str() {
  printf '"%s"' "$(printf '%s' "${1-}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')"
}

json_list() {
  out=''
  first=1
  while IFS= read -r line; do
    [ -n "$line" ] || continue
    if [ $first -eq 1 ]; then
      out=$(json_str "$line")
      first=0
    else
      out="$out, $(json_str "$line")"
    fi
  done
  printf '[%s]' "$out"
}

json_list_file() {
  if [ -s "$1" ]; then
    json_list < "$1"
  else
    printf '[]'
  fi
}

say() { printf '%s\n' "$*"; }

# ------------------------------------------------------------------ options

command_name=resolve
project=$(pwd)
skill=$SKILL_DEFAULT
agent_root=''
extra_bases=''
home_dir=${HOME:-}
no_home=0
primary_arg=''
mirrors_arg=''
mode=both
dry_run=0

if [ $# -gt 0 ]; then
  case $1 in
    -*) ;;
    *) command_name=$1; shift ;;
  esac
fi

while [ $# -gt 0 ]; do
  case $1 in
    --project) project=$2; shift 2 ;;
    --skill) skill=$2; shift 2 ;;
    --agent-root) agent_root=$2; shift 2 ;;
    --extra-base) extra_bases="$extra_bases$2
"; shift 2 ;;
    --home) home_dir=$2; shift 2 ;;
    --no-home) no_home=1; shift ;;
    --primary) primary_arg=$2; shift 2 ;;
    --mirror) mirrors_arg="$mirrors_arg$2
"; shift 2 ;;
    --mode) mode=$2; shift 2 ;;
    --dry-run) dry_run=1; shift ;;
    --help|-h) command_name=help; shift ;;
    *) say "unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [ "$command_name" = help ]; then
  cat <<'EOF'
triage-data.sh <resolve|init|sync|status> [options]
  --project <dir>      project root (default: cwd)
  --skill <name>       skill name (default: issue-triage)
  --agent-root <base>  base dir of the running agent, e.g. .codebuddy
  --extra-base <name>  additional base dir to inspect (repeatable)
  --home <dir>         override the user home directory
  --no-home            never scan the user home directory
  --primary <dir>      sync: explicit primary data directory
  --mirror <dir>       sync: explicit mirror data directory (repeatable)
  --mode <pull|push|both>  sync direction (default: both)
  --dry-run            init/sync: report actions without writing
EOF
  exit 0
fi

case $command_name in
  resolve|init|sync|status) ;;
  *) say "unknown command: $command_name" >&2; exit 1 ;;
esac
case $mode in
  pull|push|both) ;;
  *) say "invalid --mode: $mode" >&2; exit 1 ;;
esac

tmp=$(mktemp -d 2>/dev/null) || { say 'failed to create a temp directory' >&2; exit 1; }
trap 'rm -rf "$tmp"' EXIT INT TERM
: > "$tmp/cand"
: > "$tmp/installs"
: > "$tmp/warnings"
: > "$tmp/created"
: > "$tmp/updated"
: > "$tmp/skipped"
: > "$tmp/planned"
: > "$tmp/conflicts"
: > "$tmp/mirrorLinks"
: > "$tmp/syncTargets"
: > "$tmp/dataDirs"
: > "$tmp/files"

project_root=$(real_path "$project")
home_path=''
if [ -n "$home_dir" ]; then
  home_path=$(real_path "$home_dir")
fi

# ------------------------------------------------------------------ discovery

discover() {
  sroot=$1
  scope=$2
  is_dir "$sroot" || return 0
  printf '%s\t%s\t%s\n' '.' "$sroot" "$scope" >> "$tmp/cand"
  list_dirs "$sroot" | while IFS= read -r name; do
    printf '%s\t%s\t%s\n' "$name" "$sroot/$name" "$scope" >> "$tmp/cand"
  done
}

discover "$project_root" project
if [ ! -s "$tmp/cand" ] && [ "$no_home" -eq 0 ] && [ -n "$home_path" ]; then
  case $project_root in
    "$home_path"|"$home_path"/*) ;;
    *)
      : > "$tmp/cand"
      discover "$home_path" user
      ;;
  esac
fi

home_scanned=false
if [ -s "$tmp/cand" ]; then
  case $(head -n 1 "$tmp/cand" | cut -f3) in
    user) home_scanned=true ;;
  esac
fi

# build install rows: base root scope skillsDir dataDir kind target dataDirKind valid
while IFS=$TAB read -r base root scope; do
  [ -n "$base" ] || continue
  sdir=$root/skills/$skill
  ddir=$root/$skill
  has_skill=0
  [ -f "$sdir/SKILL.md" ] && has_skill=1
  data_is_skill=0
  [ -f "$ddir/SKILL.md" ] && data_is_skill=1
  has_data=0
  if exists "$ddir" && [ "$data_is_skill" -eq 0 ]; then has_data=1; fi
  if [ "$has_skill" -eq 0 ] && [ "$has_data" -eq 0 ]; then continue; fi

  kind=data
  target=''
  valid=1
  if is_link "$sdir"; then
    kind=link
    target=$(link_target "$sdir" 2>/dev/null) || target=''
  elif [ "$has_skill" -eq 1 ]; then
    kind=copy
  fi
  if [ "$kind" != data ]; then
    name=$(skill_name "$sdir" 2>/dev/null) || name=''
    if [ -n "$name" ] && [ "$name" != "$skill" ]; then
      valid=0
      say "skip $sdir: frontmatter name is \"$name\"" >> "$tmp/warnings"
    fi
  fi
  if [ "$data_is_skill" -eq 1 ]; then
    dkind=skill
  elif is_link "$ddir"; then
    dkind=link
  elif is_dir "$ddir"; then
    dkind=dir
  else
    dkind=missing
  fi
  if [ "$valid" -eq 1 ]; then
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$base" "$root" "$scope" "$sdir" "$ddir" "$kind" "$target" "$dkind" >> "$tmp/installs"
  fi
done < "$tmp/cand"

# canonical from the first link whose target looks like <base>/skills/<skill>
canonical_root=''
canonical_sdir=''
canonical_ddir=''
while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
  [ "$kind" = link ] || continue
  [ -n "$target" ] || continue
  suffix=/skills/$skill
  case $target in
    *"$suffix")
      canonical_root=${target%"$suffix"}
      canonical_sdir=$target
      canonical_ddir=$canonical_root/$skill
      break
      ;;
  esac
done < "$tmp/installs"

if [ -n "$canonical_root" ] && [ -f "$canonical_ddir/SKILL.md" ]; then
  say "data directory $canonical_ddir already holds a SKILL.md; ask the user for another location" >> "$tmp/warnings"
  canonical_root=''
  canonical_sdir=''
  canonical_ddir=''
fi

if [ -n "$canonical_root" ]; then
  marked=0
  : > "$tmp/installs2"
  while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
    if [ "$sdir" = "$canonical_sdir" ]; then
      printf '%s\t%s\t%s\t%s\t%s\tcanonical\t%s\t%s\n' "$base" "$root" "$scope" "$sdir" "$ddir" "$target" "$dkind" >> "$tmp/installs2"
      marked=1
    else
      printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$base" "$root" "$scope" "$sdir" "$ddir" "$kind" "$target" "$dkind" >> "$tmp/installs2"
    fi
  done < "$tmp/installs"
  if [ "$marked" -eq 0 ]; then
    scope=project
    case $canonical_root in
      "$home_path"/*) scope=user ;;
    esac
    vdkind=missing
    is_dir "$canonical_ddir" && vdkind=dir
    printf '%s\t%s\t%s\t%s\t%s\tcanonical\t\t%s\n' "$(basename "$canonical_root")" "$canonical_root" "$scope" "$canonical_sdir" "$canonical_ddir" "$vdkind" >> "$tmp/installs2"
  fi
  mv "$tmp/installs2" "$tmp/installs"
fi

link_count=0
copy_count=0
while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
  case $kind in
    link) link_count=$((link_count + 1)) ;;
    copy|data)
      [ "$dkind" = skill ] || copy_count=$((copy_count + 1))
      ;;
  esac
done < "$tmp/installs"

if [ "$link_count" -gt 0 ] && [ "$copy_count" -gt 0 ]; then
  mode_name=mixed
elif [ "$link_count" -gt 0 ]; then
  mode_name=link
elif [ "$copy_count" -gt 0 ]; then
  mode_name=copy
else
  mode_name=none
fi

primary=''
primary_scope=''
if [ -n "$canonical_root" ]; then
  primary=$canonical_ddir
  case $canonical_root in
    "$home_path"/*) primary_scope=user ;;
    *) primary_scope=project ;;
  esac
else
  chosen_base=''
  chosen_root=''
  chosen_scope=''
  if [ -n "$agent_root" ]; then
    while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
      case $kind in copy|data) ;; *) continue ;; esac
      [ "$dkind" = skill ] && continue
      if [ "$base" = "$agent_root" ]; then chosen_root=$ddir; chosen_scope=$scope; break; fi
    done < "$tmp/installs"
  fi
  if [ -z "$chosen_root" ]; then
    while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
      case $kind in copy|data) ;; *) continue ;; esac
      [ "$dkind" = skill ] && continue
      if [ "$scope" = project ] && [ -z "$chosen_root" ]; then chosen_root=$ddir; chosen_scope=$scope; fi
    done < "$tmp/installs"
  fi
  if [ -z "$chosen_root" ]; then
    while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
      case $kind in copy|data) ;; *) continue ;; esac
      [ "$dkind" = skill ] && continue
      chosen_root=$ddir; chosen_scope=$scope; break
    done < "$tmp/installs"
  fi
  primary=$chosen_root
  primary_scope=$chosen_scope
fi

add_unique() {
  file=$1
  value=$2
  [ -n "$value" ] || return 0
  if [ -s "$file" ] && grep -qxF "$value" "$file" 2>/dev/null; then return 0; fi
  printf '%s\n' "$value" >> "$file"
}

[ -n "$primary" ] && add_unique "$tmp/dataDirs" "$primary"
while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
  [ "$dkind" = skill ] && continue
  add_unique "$tmp/dataDirs" "$ddir"
done < "$tmp/installs"

[ -n "$primary" ] && add_unique "$tmp/syncTargets" "$primary"
while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
  case $kind in copy|data) ;; *) continue ;; esac
  [ "$dkind" = skill ] && continue
  if [ -n "$primary" ] && [ "$ddir" = "$primary" ]; then continue; fi
  add_unique "$tmp/syncTargets" "$ddir"
done < "$tmp/installs"

while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
  [ "$kind" = link ] || continue
  if [ -n "$primary" ] && [ "$ddir" = "$primary" ]; then continue; fi
  add_unique "$tmp/mirrorLinks" "$ddir"
done < "$tmp/installs"

# ------------------------------------------------------------------ operations

add_gitignore() {
  root=$1
  file=$root/.gitignore
  entry=/$skill/*
  legacy1=/$skill/
  legacy2=/$skill
  if [ -f "$file" ]; then
    if grep -qxF "$entry" "$file" 2>/dev/null; then
      printf '%s\n' "$file" >> "$tmp/skipped"
      return
    fi
    if grep -qxF "$legacy1" "$file" 2>/dev/null || grep -qxF "$legacy2" "$file" 2>/dev/null; then
      tmpf=$file.tmp.$$
      awk -v e="$entry" -v l1="$legacy1" -v l2="$legacy2" '{
        t=$0; sub(/^[ \t]+/,"",t); sub(/[ \t\r]+$/,"",t)
        if (t==l1 || t==l2) print e; else print
      }' "$file" > "$tmpf" && mv "$tmpf" "$file"
      printf '%s\n' "$file" >> "$tmp/updated"
      return
    fi
    if [ -s "$file" ]; then
      last=$(tail -c 1 "$file" | od -An -tx1 | tr -d ' \n')
      [ "$last" = "0a" ] || printf '\n' >> "$file"
    fi
    printf '%s\n' "$entry" >> "$file"
    printf '%s\n' "$file" >> "$tmp/updated"
  else
    printf '%s\n' "$entry" > "$file"
    printf '%s\n' "$file" >> "$tmp/created"
  fi
}

add_data_link() {
  link_path=$1
  target=$2
  if exists "$link_path"; then
    if is_link "$link_path"; then
      current=$(real_path "$link_path" 2>/dev/null) || current=''
      if [ "$current" = "$(real_path "$target")" ]; then
        printf '%s\n' "$link_path" >> "$tmp/skipped"
        return
      fi
    fi
    printf '%s\t%s\n' "$link_path" "existing path is not the expected link; left untouched" >> "$tmp/conflicts"
    return
  fi
  parent=$(dirname "$link_path")
  if ! is_dir "$parent"; then
    printf '%s\t%s\n' "$link_path" "agent base directory does not exist; not created" >> "$tmp/conflicts"
    return
  fi
  if [ "$dry_run" -eq 1 ]; then
    printf '%s\n' "$link_path" >> "$tmp/planned"
    return
  fi
  ln -s "$target" "$link_path" 2>/dev/null || {
    printf '%s\t%s\n' "$link_path" "failed to create link" >> "$tmp/conflicts"
    return
  }
  printf '%s\n' "$link_path" >> "$tmp/created"
}

collect_data() {
  dir=$1
  card=$dir/project-context.md
  if [ -f "$card" ]; then
    h=$(hash_file "$card")
    printf 'project-context.md\t%s\t%s\n' "$h" "$card" >> "$tmp/snap"
  fi
  if [ -d "$dir/progress" ]; then
    for f in "$dir/progress"/*.md; do
      [ -f "$f" ] || continue
      h=$(hash_file "$f")
      printf 'progress/%s\t%s\t%s\n' "$(basename "$f")" "$h" "$f" >> "$tmp/snap"
    done
  fi
}

# ------------------------------------------------------------------ JSON output

installs_json() {
  out=''
  if [ -s "$tmp/installs" ]; then
    while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
      [ -n "$base" ] || continue
      valid=true
      obj=$(printf '{"base":%s,"root":%s,"scope":%s,"kind":%s,"skillsDir":%s,"dataDir":%s,"dataDirKind":%s,"valid":%s}' \
        "$(json_str "$base")" "$(json_str "$root")" "$(json_str "$scope")" "$(json_str "$kind")" \
        "$(json_str "$sdir")" "$(json_str "$ddir")" "$(json_str "$dkind")" "$valid")
      out=${out:+$out,}$obj
    done < "$tmp/installs"
  fi
  printf '[%s]' "$out"
}

conflicts_json() {
  out=''
  if [ -s "$tmp/conflicts" ]; then
    while IFS=$TAB read -r kind a b c d e; do
      [ -n "$kind" ] || continue
      if [ "$kind" = "both" ]; then
        obj=$(printf '{"file":%s,"reason":"both sides changed","primary":%s,"primaryHash":%s,"mirror":%s,"mirrorHash":%s}' \
          "$(json_str "$a")" "$(json_str "$b")" "$(json_str "$c")" "$(json_str "$d")" "$(json_str "$e")")
      elif [ "$kind" = "missing" ]; then
        obj=$(printf '{"file":%s,"reason":"mirrors disagree while primary is missing","mirrors":[%s]}' "$(json_str "$a")" "$(json_str "$b")")
      else
        obj=$(printf '{"path":%s,"reason":%s}' "$(json_str "$kind")" "$(json_str "$a")")
      fi
      out=${out:+$out,}$obj
    done < "$tmp/conflicts"
  fi
  printf '[%s]' "$out"
}

emit_resolve() {
  primary_json='null'
  [ -n "$primary" ] && primary_json=$(json_str "$primary")
  scope_json='null'
  [ -n "$primary_scope" ] && scope_json=$(json_str "$primary_scope")
  canon_json='null'
  [ -n "$canonical_root" ] && canon_json=$(json_str "$canonical_root")
  cat <<EOF
{
  "ok": true,
  "command": "resolve",
  "skill": $(json_str "$skill"),
  "projectRoot": $(json_str "$project_root"),
  "home": $(json_str "$home_path"),
  "homeScanned": $home_scanned,
  "mode": $(json_str "$mode_name"),
  "primary": $primary_json,
  "primaryScope": $scope_json,
  "canonicalRoot": $canon_json,
  "installs": $(installs_json),
  "dataDirs": $(json_list_file "$tmp/dataDirs"),
  "syncTargets": $(json_list_file "$tmp/syncTargets"),
  "mirrorLinks": $(json_list_file "$tmp/mirrorLinks"),
  "warnings": $(json_list_file "$tmp/warnings"),
  "conflicts": $(conflicts_json),
  "actions": {"created": [], "updated": [], "skipped": [], "planned": []},
  "files": []
}
EOF
}

do_init() {
  if [ -z "$primary" ]; then
    say '{"ok": false, "command": "init", "error": "no installation found; ask the user for a data directory"}'
    return 1
  fi
  if is_dir "$primary"; then
    printf '%s\n' "$primary" >> "$tmp/skipped"
  elif [ "$dry_run" -eq 1 ]; then
    printf '%s\n' "$primary" >> "$tmp/planned"
  else
    mkdir -p "$primary" && printf '%s\n' "$primary" >> "$tmp/created"
  fi

  while IFS= read -r target; do
    [ -n "$target" ] || continue
    [ "$target" = "$primary" ] && continue
    if is_dir "$target"; then
      printf '%s\n' "$target" >> "$tmp/skipped"
    elif [ "$dry_run" -eq 1 ]; then
      printf '%s\n' "$target" >> "$tmp/planned"
    else
      mkdir -p "$target" && printf '%s\n' "$target" >> "$tmp/created"
    fi
  done < "$tmp/syncTargets"

  while IFS= read -r link_path; do
    [ -n "$link_path" ] || continue
    add_data_link "$link_path" "$primary"
  done < "$tmp/mirrorLinks"

  : > "$tmp/roots"
  while IFS=$TAB read -r base root scope sdir ddir kind target dkind; do
    [ "$dkind" = skill ] && continue
    add_unique "$tmp/roots" "$root"
  done < "$tmp/installs"
  while IFS= read -r root; do
    [ -n "$root" ] || continue
    add_gitignore "$root"
  done < "$tmp/roots"
}

do_sync() {
  sp=$primary
  if [ -n "$primary_arg" ]; then sp=$(real_path "$primary_arg"); fi
  if [ -z "$sp" ]; then
    say '{"ok": false, "command": "sync", "error": "no primary data directory; run resolve/init or pass --primary"}'
    return 1
  fi
  : > "$tmp/dirs"
  add_unique "$tmp/dirs" "$sp"
  if [ -n "$mirrors_arg" ]; then
    printf '%s' "$mirrors_arg" | while IFS= read -r m; do
      [ -n "$m" ] || continue
      add_unique "$tmp/dirs" "$(real_path "$m")"
    done
  else
    while IFS= read -r d; do
      [ -n "$d" ] || continue
      [ "$d" = "$sp" ] && continue
      add_unique "$tmp/dirs" "$d"
    done < "$tmp/syncTargets"
  fi

  dir_count=$(wc -l < "$tmp/dirs" | tr -d ' ')
  if [ "$dir_count" -lt 2 ]; then
    say '{"ok": true, "command": "sync", "warnings": ["single data directory; nothing to sync"], "conflicts": [], "actions": {"created": [], "updated": [], "skipped": [], "planned": []}}'
    return 0
  fi

  : > "$tmp/rels"
  idx=0
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    idx=$((idx + 1))
    : > "$tmp/snap_$idx"
    : > "$tmp/snap"
    collect_data "$dir"
    if [ -s "$tmp/snap" ]; then
      while IFS=$TAB read -r rel h path; do
        printf '%s\t%s\t%s\t%s\n' "$rel" "$h" "$path" "$dir" >> "$tmp/snap_$idx"
        printf '%s\n' "$rel" >> "$tmp/rels"
      done < "$tmp/snap"
    fi
  done < "$tmp/dirs"
  sort -u "$tmp/rels" -o "$tmp/rels"

  while IFS= read -r rel; do
    [ -n "$rel" ] || continue
    p_row=$(awk -F'\t' -v r="$rel" '$1==r{print;exit}' "$tmp/snap_1" 2>/dev/null)
    p_hash=''
    p_path=''
    if [ -n "$p_row" ]; then
      p_hash=$(printf '%s' "$p_row" | cut -f2)
      p_path=$(printf '%s' "$p_row" | cut -f3)
    fi

    if [ "$mode" != push ] && [ -z "$p_hash" ]; then
      # pull: look for the file in mirrors
      found_dir=''
      found_hash=''
      found_path=''
      multi=0
      i=2
      while [ "$i" -le "$dir_count" ]; do
        row=$(awk -F'\t' -v r="$rel" '$1==r{print;exit}' "$tmp/snap_$i" 2>/dev/null)
        if [ -n "$row" ]; then
          h=$(printf '%s' "$row" | cut -f2)
          p=$(printf '%s' "$row" | cut -f3)
          if [ -z "$found_hash" ]; then
            found_hash=$h; found_path=$p; found_dir=$(sed -n "${i}p" "$tmp/dirs")
          elif [ "$h" != "$found_hash" ]; then
            multi=1
          fi
        fi
        i=$((i + 1))
      done
      if [ "$multi" -eq 1 ]; then
        printf 'missing\t%s\t%s\n' "$rel" "multiple mirrors" >> "$tmp/conflicts"
      elif [ -n "$found_hash" ]; then
        if [ "$dry_run" -eq 1 ]; then
          printf 'pull %s -> %s\n' "$rel" "$sp" >> "$tmp/planned"
        else
          mkdir -p "$(dirname "$sp/$rel")"
          cp -f "$found_path" "$sp/$rel" 2>/dev/null || cp -f "$found_path" "$sp/$rel"
          printf '%s -> %s\n' "$rel" "$sp" >> "$tmp/created"
          p_hash=$found_hash
          p_path=$sp/$rel
        fi
      fi
    fi

    if [ "$mode" != pull ] && [ -n "$p_hash" ]; then
      i=2
      while [ "$i" -le "$dir_count" ]; do
        mdir=$(sed -n "${i}p" "$tmp/dirs")
        row=$(awk -F'\t' -v r="$rel" '$1==r{print;exit}' "$tmp/snap_$i" 2>/dev/null)
        if [ -z "$row" ]; then
          if [ "$dry_run" -eq 1 ]; then
            printf 'push %s -> %s\n' "$rel" "$mdir" >> "$tmp/planned"
          else
            mkdir -p "$(dirname "$mdir/$rel")"
            cp -f "$p_path" "$mdir/$rel" 2>/dev/null || cp -f "$p_path" "$mdir/$rel"
            printf '%s -> %s\n' "$rel" "$mdir" >> "$tmp/created"
          fi
        else
          m_hash=$(printf '%s' "$row" | cut -f2)
          if [ "$m_hash" != "$p_hash" ]; then
            printf 'both\t%s\t%s\t%s\t%s\t%s\n' "$rel" "$sp" "$(printf '%s' "$p_hash" | cut -c1-12)" "$mdir" "$(printf '%s' "$m_hash" | cut -c1-12)" >> "$tmp/conflicts"
          else
            printf '%s @ %s\n' "$rel" "$mdir" >> "$tmp/skipped"
          fi
        fi
        i=$((i + 1))
      done
    fi
  done < "$tmp/rels"
}

do_status() {
  : > "$tmp/files"
  while IFS= read -r dir; do
    [ -n "$dir" ] || continue
    : > "$tmp/snap"
    collect_data "$dir"
    if [ -s "$tmp/snap" ]; then
      while IFS=$TAB read -r rel h path; do
        size=$(wc -c < "$path" 2>/dev/null | tr -d ' ')
        printf '%s\t%s\t%s\t%s\n' "$dir" "$rel" "$h" "$size" >> "$tmp/files"
      done < "$tmp/snap"
    fi
  done < "$tmp/dataDirs"
}

emit_actions() {
  cat <<EOF
  "actions": {
    "created": $(json_list_file "$tmp/created"),
    "updated": $(json_list_file "$tmp/updated"),
    "skipped": $(json_list_file "$tmp/skipped"),
    "planned": $(json_list_file "$tmp/planned")
  },
  "conflicts": $(conflicts_json)
EOF
}

case $command_name in
  resolve)
    emit_resolve
    exit 0
    ;;
  init)
    do_init || exit 1
    primary_json='null'
    [ -n "$primary" ] && primary_json=$(json_str "$primary")
    cat <<EOF
{
  "ok": $([ -s "$tmp/conflicts" ] && printf false || printf true),
  "command": "init",
  "skill": $(json_str "$skill"),
  "mode": $(json_str "$mode_name"),
  "primary": $primary_json,
  "mirrorLinks": $(json_list_file "$tmp/mirrorLinks"),
  "syncTargets": $(json_list_file "$tmp/syncTargets"),
  "dryRun": $([ "$dry_run" -eq 1 ] && printf true || printf false),
$(emit_actions)
}
EOF
    if [ -s "$tmp/conflicts" ]; then exit 2; fi
    exit 0
    ;;
  sync)
    do_sync || exit 1
    dir_count=$(wc -l < "$tmp/dirs" 2>/dev/null | tr -d ' ')
    if [ "$dir_count" -lt 2 ]; then exit 0; fi
    cat <<EOF
{
  "ok": $([ -s "$tmp/conflicts" ] && printf false || printf true),
  "command": "sync",
  "skill": $(json_str "$skill"),
  "primary": $(json_str "$sp"),
  "mirrors": $(sed '1d' "$tmp/dirs" | json_list),
  "dryRun": $([ "$dry_run" -eq 1 ] && printf true || printf false),
$(emit_actions)
}
EOF
    if [ -s "$tmp/conflicts" ]; then exit 2; fi
    exit 0
    ;;
  status)
    do_status
    files_json=''
    if [ -s "$tmp/files" ]; then
      while IFS=$TAB read -r dir rel h size; do
        [ -n "$dir" ] || continue
        obj=$(printf '{"dir":%s,"path":%s,"hash":%s,"size":%s}' "$(json_str "$dir")" "$(json_str "$rel")" "$(json_str "$h")" "$size")
        files_json=${files_json:+$files_json,}$obj
      done < "$tmp/files"
    fi
    cat <<EOF
{
  "ok": true,
  "command": "status",
  "skill": $(json_str "$skill"),
  "primary": $(json_str "$primary"),
  "dataDirs": $(json_list_file "$tmp/dataDirs"),
  "files": [$files_json]
}
EOF
    exit 0
    ;;
esac
