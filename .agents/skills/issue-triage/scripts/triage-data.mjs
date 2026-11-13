#!/usr/bin/env node
/**
 * issue-triage data directory helper (Node ESM).
 *
 * Commands:
 *   resolve  detect installation topology and print JSON
 *   init     create data directories, mirror links, gitignore entries (idempotent)
 *   sync     pull missing files in, push changed files out, report conflicts
 *   status   list data files per data directory
 *
 * Options:
 *   --project <dir>      project root (default: cwd)
 *   --skill <name>       skill name (default: issue-triage)
 *   --agent-root <base>  base dir of the running agent, e.g. .codebuddy
 *   --extra-base <name>  additional base dir to inspect (repeatable)
 *   --home <dir>         override the user home directory
 *   --no-home            never scan the user home directory
 *   --primary <dir>      sync: explicit primary data directory
 *   --mirror <dir>       sync: explicit mirror data directory (repeatable)
 *   --mode <pull|push|both>  sync direction (default: both)
 *   --dry-run            init/sync: report actions without writing
 *
 * Exit codes: 0 success, 1 usage/runtime error, 2 sync conflicts reported.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const WIN = process.platform === 'win32';
const SKILL = 'issue-triage';

const out = (p) => (p === null || p === undefined ? p : String(p).replace(/\\/g, '/'));
const stripLong = (p) => String(p).replace(/^\\\\\?\\/, '');
const keyOf = (p) => {
  const v = stripLong(path.resolve(p)).replace(/\\/g, '/');
  return WIN ? v.toLowerCase() : v;
};
const samePath = (a, b) => {
  try {
    return keyOf(a) === keyOf(b);
  } catch {
    return false;
  }
};

const E = {
  exists(p) {
    try {
      fs.lstatSync(p);
      return true;
    } catch {
      return false;
    }
  },
  isDir(p) {
    try {
      return fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  },
  isLink(p) {
    try {
      return fs.lstatSync(p).isSymbolicLink();
    } catch {
      return false;
    }
  },
  real(p) {
    try {
      return stripLong(fs.realpathSync(p));
    } catch {
      return null;
    }
  },
  read(p) {
    try {
      return fs.readFileSync(p, 'utf8');
    } catch {
      return null;
    }
  },
  write(p, text) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text, 'utf8');
  },
  listDirs(p) {
    try {
      return fs
        .readdirSync(p, { withFileTypes: true })
        .filter((e) => {
          const full = path.join(p, e.name);
          return e.isDirectory() || (e.isSymbolicLink() && E.isDir(full));
        })
        .map((e) => e.name);
    } catch {
      return [];
    }
  },
  listFiles(p) {
    try {
      return fs.readdirSync(p, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => e.name);
    } catch {
      return [];
    }
  },
  sha(buf) {
    return crypto.createHash('sha256').update(buf).digest('hex');
  },
};

function parseArgs(argv) {
  const opts = {
    command: 'resolve',
    project: process.cwd(),
    skill: SKILL,
    agentRoot: null,
    extraBases: [],
    home: os.homedir(),
    noHome: false,
    primary: null,
    mirrors: [],
    mode: 'both',
    dryRun: false,
  };
  const rest = argv.slice();
  if (rest.length > 0 && !rest[0].startsWith('-')) opts.command = rest.shift();
  const take = (a) => {
    const v = rest.shift();
    if (v === undefined) throw new Error(`missing value for ${a}`);
    return v;
  };
  while (rest.length > 0) {
    const a = rest.shift();
    if (a === '--project') opts.project = take(a);
    else if (a === '--skill') opts.skill = take(a);
    else if (a === '--agent-root') opts.agentRoot = take(a);
    else if (a === '--extra-base') opts.extraBases.push(take(a));
    else if (a === '--home') opts.home = take(a);
    else if (a === '--no-home') opts.noHome = true;
    else if (a === '--primary') opts.primary = take(a);
    else if (a === '--mirror') opts.mirrors.push(take(a));
    else if (a === '--mode') opts.mode = take(a);
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--help' || a === '-h') opts.command = 'help';
    else throw new Error(`unknown argument: ${a}`);
  }
  if (!['resolve', 'init', 'sync', 'status', 'help'].includes(opts.command)) {
    throw new Error(`unknown command: ${opts.command}`);
  }
  if (!['pull', 'push', 'both'].includes(opts.mode)) throw new Error(`invalid --mode: ${opts.mode}`);
  return opts;
}

function readSkillName(skillsDir) {
  const text = E.read(path.join(skillsDir, 'SKILL.md'));
  if (text === null) return null;
  const fm = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const m = fm[1].match(/^\s*name\s*:\s*(.+?)\s*$/m);
  return m ? m[1].replace(/^["']|["']$/g, '') : null;
}

function discover(scopeRoot, scope, skill, extraBases) {
  const found = [];
  if (!E.isDir(scopeRoot)) return found;
  const roots = new Map();
  roots.set('.', scopeRoot);
  for (const name of E.listDirs(scopeRoot)) roots.set(name, path.join(scopeRoot, name));
  for (const name of extraBases) {
    if (!roots.has(name) && E.isDir(path.join(scopeRoot, name))) roots.set(name, path.join(scopeRoot, name));
  }
  for (const [base, root] of roots) {
    const skillsDir = path.join(root, 'skills', skill);
    const dataDir = path.join(root, skill);
    const hasSkill = E.exists(path.join(skillsDir, 'SKILL.md'));
    const dataIsSkill = E.exists(path.join(dataDir, 'SKILL.md'));
    const hasData = E.exists(dataDir) && !dataIsSkill;
    if (!hasSkill && !hasData) continue;
    found.push({ base, root, scope, skillsDir, dataDir, kind: null, target: null, dataDirKind: null, dataIsSkill, valid: true });
  }
  return found;
}

function classify(installs, skill) {
  const warnings = [];
  const kept = [];
  for (const inst of installs) {
    if (E.isLink(inst.skillsDir)) {
      inst.kind = 'link';
      inst.target = E.real(inst.skillsDir);
    } else if (E.exists(path.join(inst.skillsDir, 'SKILL.md'))) {
      inst.kind = 'copy';
    } else {
      inst.kind = 'data';
    }
    if (inst.kind !== 'data') {
      const name = readSkillName(inst.skillsDir);
      if (name !== null && name !== skill) {
        warnings.push(`skip ${out(inst.skillsDir)}: frontmatter name is "${name}"`);
        inst.valid = false;
      }
    }
    if (inst.dataIsSkill) inst.dataDirKind = 'skill';
    else if (E.isLink(inst.dataDir)) inst.dataDirKind = 'link';
    else if (E.isDir(inst.dataDir)) inst.dataDirKind = 'dir';
    else inst.dataDirKind = 'missing';
    if (inst.valid) kept.push(inst);
  }
  return { kept, warnings };
}

function canonicalFrom(kept, skill) {
  const links = kept.filter((i) => i.kind === 'link' && i.target);
  if (links.length === 0) return null;
  const suffix = `${path.sep}skills${path.sep}${skill}`;
  for (const link of links) {
    if (!link.target.endsWith(suffix)) continue;
    const root = link.target.slice(0, link.target.length - suffix.length);
    const scope = kept.find((i) => samePath(i.skillsDir, link.target))?.scope;
    return { root, skillsDir: link.target, dataDir: path.join(root, skill), scope: scope ?? 'unknown' };
  }
  return null;
}

function isUnder(dir, parent) {
  const d = keyOf(dir);
  const p = keyOf(parent);
  return d === p || d.startsWith(p + '/');
}

function resolveTopology(opts) {
  const projectRoot = path.resolve(opts.project);
  let installs = discover(projectRoot, 'project', opts.skill, opts.extraBases);
  let homeScanned = false;
  if (installs.length === 0 && !opts.noHome && !isUnder(projectRoot, opts.home)) {
    installs = discover(path.resolve(opts.home), 'user', opts.skill, opts.extraBases);
    homeScanned = true;
  }
  const { kept, warnings } = classify(installs, opts.skill);
  const canonicalRaw = canonicalFrom(kept, opts.skill);
  let canonical = canonicalRaw;
  if (canonicalRaw && E.exists(path.join(canonicalRaw.dataDir, 'SKILL.md'))) {
    warnings.push(`data directory ${out(canonicalRaw.dataDir)} already holds a SKILL.md; ask the user for another location`);
    canonical = null;
  }
  if (canonical && !kept.some((i) => samePath(i.skillsDir, canonical.skillsDir))) {
    kept.push({
      base: path.basename(canonical.root) || '.',
      root: canonical.root,
      scope: isUnder(canonical.root, opts.home) ? 'user' : 'project',
      skillsDir: canonical.skillsDir,
      dataDir: canonical.dataDir,
      kind: 'canonical',
      target: null,
      dataDirKind: E.isDir(canonical.dataDir) ? 'dir' : 'missing',
      dataIsSkill: false,
      valid: true,
    });
  } else if (canonical) {
    for (const inst of kept) if (samePath(inst.skillsDir, canonical.skillsDir)) inst.kind = 'canonical';
  }
  const links = kept.filter((i) => i.kind === 'link');
  const copies = kept.filter((i) => (i.kind === 'copy' || i.kind === 'data') && i.dataDirKind !== 'skill');

  let primary = null;
  let primaryScope = null;
  if (canonical) {
    primary = canonical.dataDir;
    primaryScope = isUnder(canonical.root, opts.home) ? 'user' : 'project';
  } else {
    const candidates = copies;
    let chosen = null;
    if (opts.agentRoot) chosen = candidates.find((i) => i.base === opts.agentRoot);
    if (!chosen) chosen = candidates.find((i) => i.scope === 'project') ?? candidates[0] ?? null;
    if (chosen) {
      primary = chosen.dataDir;
      primaryScope = chosen.scope;
    }
  }

  const linkCount = links.length;
  const copyCount = copies.length;
  const mode = linkCount > 0 && copyCount > 0 ? 'mixed' : linkCount > 0 ? 'link' : copyCount > 0 ? 'copy' : 'none';

  const allDataDirs = [];
  const seen = new Set();
  const pushDir = (d) => {
    if (!d) return;
    const k = keyOf(d);
    if (seen.has(k)) return;
    seen.add(k);
    allDataDirs.push(d);
  };
  pushDir(primary);
  for (const inst of kept) if (inst.dataDirKind !== 'skill') pushDir(inst.dataDir);

  const syncTargets = [];
  if (primary) syncTargets.push(primary);
  for (const inst of copies) {
    if (!primary || keyOf(inst.dataDir) !== keyOf(primary)) syncTargets.push(inst.dataDir);
  }

  const mirrorLinks = links.map((i) => i.dataDir).filter((d) => !primary || keyOf(d) !== keyOf(primary));

  if (kept.some((i) => i.base === '.' && i.kind === 'data')) {
    warnings.push(`base "." maps the data directory to ${out(path.join(projectRoot, opts.skill))}; confirm it does not overlap another skill folder`);
  }

  return {
    ok: true,
    command: 'resolve',
    skill: opts.skill,
    projectRoot,
    home: path.resolve(opts.home),
    homeScanned,
    mode,
    primary,
    primaryScope,
    canonicalRoot: canonical ? canonical.root : null,
    installs: kept.map((i) => ({
      base: i.base,
      root: i.root,
      scope: i.scope,
      kind: i.kind,
      skillsDir: i.skillsDir,
      dataDir: i.dataDir,
      dataDirKind: i.dataDirKind,
      valid: i.valid,
    })),
    dataDirs: allDataDirs,
    syncTargets,
    mirrorLinks,
    warnings,
    conflicts: [],
    actions: { created: [], updated: [], skipped: [], planned: [] },
    files: [],
  };
}

function ensureGitignore(root, skill, dryRun, actions) {
  const file = path.join(root, '.gitignore');
  const entry = `/${skill}/*`;
  const legacy = new Set([`/${skill}/`, `/${skill}`]);
  const current = E.read(file);
  const lines = (current ?? '').split(/\r?\n/).map((l) => l.trim());
  if (lines.includes(entry)) {
    actions.skipped.push(out(file));
    return;
  }
  let next;
  if (lines.some((l) => legacy.has(l))) {
    next = current
      .split(/(?<=\n)/)
      .map((line) => {
        const bare = line.replace(/\r?\n$/, '');
        if (!legacy.has(bare.trim())) return line;
        const eol = line.endsWith('\r\n') ? '\r\n' : line.endsWith('\n') ? '\n' : '';
        return `${entry}${eol}`;
      })
      .join('');
  } else {
    const prefix = current === null || current === '' ? '' : current.endsWith('\n') ? current : `${current}\n`;
    next = `${prefix}${entry}\n`;
  }
  if (dryRun) {
    actions.planned.push(out(file));
    return;
  }
  E.write(file, next);
  actions[current === null ? 'created' : 'updated'].push(out(file));
}

function ensureDataLink(linkPath, target, dryRun, actions, conflicts) {
  if (E.exists(linkPath)) {
    if (E.isLink(linkPath) && samePath(E.real(linkPath), target)) {
      actions.skipped.push(out(linkPath));
      return;
    }
    conflicts.push({ path: out(linkPath), reason: 'existing path is not the expected link; left untouched' });
    return;
  }
  if (!E.isDir(path.dirname(linkPath))) {
    conflicts.push({ path: out(linkPath), reason: 'agent base directory does not exist; not created' });
    return;
  }
  if (dryRun) {
    actions.planned.push(out(linkPath));
    return;
  }
  fs.symlinkSync(target, linkPath, WIN ? 'junction' : 'dir');
  actions.created.push(out(linkPath));
}

function initData(opts) {
  const topo = resolveTopology(opts);
  const result = { ...topo, command: 'init', ok: true, dryRun: opts.dryRun };
  if (!topo.primary) {
    result.ok = false;
    result.warnings = [...topo.warnings, 'no installation found; ask the user for a data directory'];
    return result;
  }
  const actions = { created: [], updated: [], skipped: [], planned: [] };
  const conflicts = [];
  const primary = topo.primary;

  if (!E.isDir(primary)) {
    if (opts.dryRun) actions.planned.push(out(primary));
    else {
      fs.mkdirSync(primary, { recursive: true });
      actions.created.push(out(primary));
    }
  } else actions.skipped.push(out(primary));

  for (const target of topo.syncTargets) {
    if (samePath(target, primary)) continue;
    if (E.isDir(target)) {
      actions.skipped.push(out(target));
      continue;
    }
    if (opts.dryRun) actions.planned.push(out(target));
    else {
      fs.mkdirSync(target, { recursive: true });
      actions.created.push(out(target));
    }
  }

  for (const linkPath of topo.mirrorLinks) ensureDataLink(linkPath, primary, opts.dryRun, actions, conflicts);

  const roots = new Set();
  for (const inst of topo.installs) if (inst.dataDirKind !== 'skill') roots.add(inst.root);
  for (const root of roots) ensureGitignore(root, opts.skill, opts.dryRun, actions);

  result.actions = actions;
  result.conflicts = conflicts;
  result.ok = conflicts.length === 0;
  return result;
}

function collectData(dir) {
  const files = new Map();
  const card = path.join(dir, 'project-context.md');
  if (E.exists(card)) {
    try {
      const buf = fs.readFileSync(card);
      files.set('project-context.md', { hash: E.sha(buf), buf });
    } catch {
      /* ignore */
    }
  }
  const progress = path.join(dir, 'progress');
  for (const name of E.listFiles(progress)) {
    if (!name.endsWith('.md')) continue;
    try {
      const buf = fs.readFileSync(path.join(progress, name));
      files.set(`progress/${name}`, { hash: E.sha(buf), buf });
    } catch {
      /* ignore */
    }
  }
  return files;
}

function writeData(dir, rel, buf) {
  const target = path.join(dir, ...rel.split('/'));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buf);
}

function syncData(opts, topo) {
  const result = { ...topo, command: 'sync', ok: true, dryRun: opts.dryRun };
  const primary = opts.primary ? path.resolve(opts.primary) : topo.primary;
  const mirrors = opts.mirrors.length > 0 ? opts.mirrors.map((m) => path.resolve(m)) : topo.syncTargets.filter((d) => !primary || keyOf(d) !== keyOf(primary));
  if (!primary) {
    result.ok = false;
    result.warnings = [...topo.warnings, 'no primary data directory; run resolve/init or pass --primary'];
    return result;
  }
  const dirs = [primary, ...mirrors.filter((m) => keyOf(m) !== keyOf(primary))];
  if (dirs.length < 2) {
    result.warnings = [...topo.warnings, 'single data directory; nothing to sync'];
    result.primary = primary;
    return result;
  }
  const snap = new Map(dirs.map((d) => [d, collectData(d)]));
  const rels = new Set();
  for (const m of snap.values()) for (const rel of m.keys()) rels.add(rel);

  const actions = { created: [], updated: [], skipped: [], planned: [] };
  const conflicts = [];

  for (const rel of [...rels].sort()) {
    const primaryFiles = snap.get(primary);
    let primaryEntry = primaryFiles.get(rel);

    if (opts.mode !== 'push' && !primaryEntry) {
      const have = dirs.slice(1).filter((d) => snap.get(d).has(rel));
      if (have.length > 0) {
        const hashes = new Set(have.map((d) => snap.get(d).get(rel).hash));
        if (hashes.size > 1) {
          conflicts.push({ file: rel, reason: 'mirrors disagree while primary is missing', mirrors: have.map(out) });
        } else {
          const src = snap.get(have[0]).get(rel);
          if (opts.dryRun) actions.planned.push(`pull ${rel} -> ${out(primary)}`);
          else {
            writeData(primary, rel, src.buf);
            primaryFiles.set(rel, src);
            actions.created.push(`${rel} -> ${out(primary)}`);
          }
          primaryEntry = src;
        }
      }
    }

    if (opts.mode !== 'pull' && primaryEntry) {
      for (const d of dirs.slice(1)) {
        const mirrorEntry = snap.get(d).get(rel);
        if (!mirrorEntry) {
          if (opts.dryRun) actions.planned.push(`push ${rel} -> ${out(d)}`);
          else {
            writeData(d, rel, primaryEntry.buf);
            actions.created.push(`${rel} -> ${out(d)}`);
          }
        } else if (mirrorEntry.hash !== primaryEntry.hash) {
          conflicts.push({
            file: rel,
            reason: 'both sides changed',
            primary: out(primary),
            primaryHash: primaryEntry.hash.slice(0, 12),
            mirror: out(d),
            mirrorHash: mirrorEntry.hash.slice(0, 12),
          });
        } else {
          actions.skipped.push(`${rel} @ ${out(d)}`);
        }
      }
    }
  }

  result.primary = primary;
  result.mirrors = dirs.slice(1);
  result.actions = actions;
  result.conflicts = conflicts;
  result.ok = conflicts.length === 0;
  return result;
}

function statusData(opts) {
  const topo = resolveTopology(opts);
  const result = { ...topo, command: 'status', ok: true };
  const files = [];
  for (const dir of topo.dataDirs) {
    for (const [rel, value] of collectData(dir)) {
      files.push({ dir: out(dir), path: rel, hash: value.hash, size: value.buf.length });
    }
  }
  result.files = files;
  return result;
}

function deepPosix(value) {
  if (typeof value === 'string') return value.replace(/\\/g, '/');
  if (Array.isArray(value)) return value.map(deepPosix);
  if (value && typeof value === 'object') {
    const converted = {};
    for (const [k, v] of Object.entries(value)) converted[k] = deepPosix(v);
    return converted;
  }
  return value;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.log(JSON.stringify({ ok: false, command: 'unknown', error: err instanceof Error ? err.message : String(err) }, null, 2));
    process.exit(1);
  }
  if (opts.command === 'help') {
    console.log(
      [
        'triage-data.mjs <resolve|init|sync|status> [options]',
        '  --project <dir>      project root (default: cwd)',
        '  --skill <name>       skill name (default: issue-triage)',
        '  --agent-root <base>  base dir of the running agent, e.g. .codebuddy',
        '  --extra-base <name>  additional base dir to inspect (repeatable)',
        '  --home <dir>         override the user home directory',
        '  --no-home            never scan the user home directory',
        '  --primary <dir>      sync: explicit primary data directory',
        '  --mirror <dir>       sync: explicit mirror data directory (repeatable)',
        '  --mode <pull|push|both>  sync direction (default: both)',
        '  --dry-run            init/sync: report actions without writing',
      ].join('\n'),
    );
    return;
  }

  let result;
  try {
    if (opts.command === 'resolve') result = resolveTopology(opts);
    else if (opts.command === 'init') result = initData(opts);
    else if (opts.command === 'sync') result = syncData(opts, resolveTopology(opts));
    else result = statusData(opts);
  } catch (err) {
    console.log(JSON.stringify({ ok: false, command: opts.command, error: err instanceof Error ? err.message : String(err) }, null, 2));
    process.exit(1);
  }

  const normalized = deepPosix(result);
  console.log(JSON.stringify(normalized, null, 2));
  if (result.conflicts && result.conflicts.length > 0) process.exit(2);
}

main();
