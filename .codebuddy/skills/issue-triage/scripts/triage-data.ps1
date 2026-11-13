#!/usr/bin/env pwsh
#Requires -Version 7.0
# issue-triage data directory helper (PowerShell 7+ / pwsh).
# Do not invoke this script with Windows PowerShell 5.1 (powershell.exe).
# Commands: resolve | init | sync | status
# Exit codes: 0 success, 1 usage/runtime error, 2 sync conflicts reported.
$ErrorActionPreference = 'Stop'
$script:Win = [bool]$IsWindows
$script:Utf8 = New-Object System.Text.UTF8Encoding($false)

function To-Posix([string]$p) {
  if ($null -eq $p) { return $null }
  return ($p -replace '\\', '/')
}

function Join-P([string]$a, [string]$b) {
  return ($a.TrimEnd('/') + '/' + $b.TrimStart('/'))
}

function Path-Key([string]$p) {
  $v = To-Posix $p
  if ($script:Win) { return $v.ToLower() }
  return $v
}

function Same-Path([string]$a, [string]$b) {
  return ((Path-Key $a) -eq (Path-Key $b))
}

function Test-Dir([string]$p) {
  try { return (Test-Path -LiteralPath $p -PathType Container) } catch { return $false }
}

function Test-Ex([string]$p) {
  try { return (Test-Path -LiteralPath $p) } catch { return $false }
}

function Test-Link([string]$p) {
  try {
    $i = Get-Item -LiteralPath $p -Force -ErrorAction Stop
    return [bool]$i.LinkType
  } catch { return $false }
}

function Get-LinkTarget([string]$p) {
  $i = $null
  try { $i = Get-Item -LiteralPath $p -Force -ErrorAction Stop } catch { return $null }
  try {
    $t = $i.ResolveLinkTarget($true)
    if ($t) { return (To-Posix $t.FullName) }
  } catch { }
  $raw = $null
  try { $raw = @($i.Target)[0] } catch { $raw = $null }
  if (-not $raw) { return $null }
  if (-not [IO.Path]::IsPathRooted($raw)) { $raw = Join-Path (Split-Path -Parent $p) $raw }
  try { return (To-Posix ([IO.Path]::GetFullPath($raw))) } catch { return (To-Posix $raw) }
}

function Get-Real([string]$p, [int]$Depth = 0) {
  if ($Depth -gt 10) { return $null }
  try {
    if (Test-Link $p) {
      $t = Get-LinkTarget $p
      if (-not $t) { return $null }
      return (Get-Real $t ($Depth + 1))
    }
    $i = Get-Item -LiteralPath $p -Force -ErrorAction Stop
    return (To-Posix ([IO.Path]::GetFullPath($i.FullName)))
  } catch { return $null }
}

function Get-SkillName([string]$dir) {
  $file = Join-P $dir 'SKILL.md'
  if (-not (Test-Ex $file)) { return $null }
  try { $text = [IO.File]::ReadAllText($file) } catch { return $null }
  $fm = [regex]::Match($text, "(?s)^\uFEFF?---\r?\n(.*?)\r?\n---")
  if (-not $fm.Success) { return $null }
  $nm = [regex]::Match($fm.Groups[1].Value, "(?m)^\s*name\s*:\s*(.+?)\s*$")
  if (-not $nm.Success) { return $null }
  return $nm.Groups[1].Value.Trim().Trim('"').Trim("'")
}

function Get-ChildDirNames([string]$p) {
  try {
    return @(Get-ChildItem -LiteralPath $p -Force -Directory -ErrorAction Stop | ForEach-Object { $_.Name })
  } catch { return @() }
}

function Get-ChildFileNames([string]$p) {
  try {
    return @(Get-ChildItem -LiteralPath $p -Force -File -ErrorAction Stop | ForEach-Object { $_.Name })
  } catch { return @() }
}

function Get-HashHex([string]$p) {
  try { return (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower() } catch { return $null }
}

# ---------------------------------------------------------------- discovery

function Find-Installs([string]$ScopeRoot, [string]$Scope, [string]$Skill, [string[]]$ExtraBases) {
  $items = New-Object System.Collections.Generic.List[object]
  if (-not (Test-Dir $ScopeRoot)) { return $items }
  $roots = [ordered]@{}
  $roots['.'] = $ScopeRoot
  foreach ($name in (Get-ChildDirNames $ScopeRoot)) { $roots[$name] = (Join-P $ScopeRoot $name) }
  foreach ($name in $ExtraBases) {
    if (-not $roots.Contains($name) -and (Test-Dir (Join-P $ScopeRoot $name))) { $roots[$name] = (Join-P $ScopeRoot $name) }
  }
  foreach ($base in @($roots.Keys)) {
    $root = $roots[$base]
    $skillsDir = Join-P (Join-P $root 'skills') $Skill
    $dataDir = Join-P $root $Skill
    $hasSkill = Test-Ex (Join-P $skillsDir 'SKILL.md')
    $dataIsSkill = Test-Ex (Join-P $dataDir 'SKILL.md')
    $hasData = (Test-Ex $dataDir) -and (-not $dataIsSkill)
    if (-not $hasSkill -and -not $hasData) { continue }
    $items.Add([ordered]@{
        base = $base; root = $root; scope = $Scope; skillsDir = $skillsDir; dataDir = $dataDir
        kind = $null; target = $null; dataDirKind = $null; dataIsSkill = $dataIsSkill; valid = $true
      })
  }
  return $items
}

function Classify-Installs($Items, [string]$Skill) {
  $warnings = New-Object System.Collections.Generic.List[string]
  foreach ($inst in $Items) {
    if (Test-Link $inst.skillsDir) {
      $inst.kind = 'link'
      $inst.target = Get-Real $inst.skillsDir
    } elseif (Test-Ex (Join-P $inst.skillsDir 'SKILL.md')) {
      $inst.kind = 'copy'
    } else {
      $inst.kind = 'data'
    }
    if ($inst.kind -ne 'data') {
      $name = Get-SkillName $inst.skillsDir
      if ($null -ne $name -and $name -ne $Skill) {
        $warnings.Add("skip $($inst.skillsDir): frontmatter name is `"$name`"")
        $inst.valid = $false
      }
    }
    if ($inst.dataIsSkill) { $inst.dataDirKind = 'skill' }
    elseif (Test-Link $inst.dataDir) { $inst.dataDirKind = 'link' }
    elseif (Test-Dir $inst.dataDir) { $inst.dataDirKind = 'dir' }
    else { $inst.dataDirKind = 'missing' }
  }
  return , $warnings
}

function Find-Canonical($Items, [string]$Skill) {
  $links = @($Items | Where-Object { $_.kind -eq 'link' -and $_.target })
  if ($links.Count -eq 0) { return $null }
  $suffix = "/skills/$Skill"
  foreach ($link in $links) {
    if (-not $link.target.EndsWith($suffix)) { continue }
    $root = $link.target.Substring(0, $link.target.Length - $suffix.Length)
    $match = @($Items | Where-Object { (Path-Key $_.skillsDir) -eq (Path-Key $link.target) }) | Select-Object -First 1
    $scope = if ($match) { $match.scope } else { 'unknown' }
    return [ordered]@{ root = $root; skillsDir = $link.target; dataDir = (Join-P $root $Skill); scope = $scope }
  }
  return $null
}

function Test-Under([string]$dir, [string]$parent) {
  $d = Path-Key $dir
  $p = Path-Key $parent
  return ($d -eq $p) -or $d.StartsWith($p + '/')
}

function Get-Topology([string]$Project, [string]$Skill, [string]$AgentRoot, [string[]]$ExtraBases, [string]$HomePath, [bool]$NoHome) {
  $projectRoot = To-Posix ([IO.Path]::GetFullPath($Project))
  $homePath = To-Posix ([IO.Path]::GetFullPath($HomePath))
  $installs = Find-Installs $projectRoot 'project' $Skill $ExtraBases
  $homeScanned = $false
  if ($installs.Count -eq 0 -and (-not $NoHome) -and (-not (Test-Under $projectRoot $homePath))) {
    $installs = Find-Installs $homePath 'user' $Skill $ExtraBases
    $homeScanned = $true
  }
  $warnings = Classify-Installs $installs $Skill
  $canonical = Find-Canonical $installs $Skill
  if ($canonical -and (Test-Ex (Join-P $canonical.dataDir 'SKILL.md'))) {
    $warnings.Add("data directory $($canonical.dataDir) already holds a SKILL.md; ask the user for another location")
    $canonical = $null
  }
  if ($canonical) {
    $match = @($installs | Where-Object { (Path-Key $_.skillsDir) -eq (Path-Key $canonical.skillsDir) }) | Select-Object -First 1
    if ($match) {
      $match.kind = 'canonical'
    } else {
      $installs.Add([ordered]@{
          base = (Split-Path -Leaf $canonical.root); root = $canonical.root
          scope = $(if (Test-Under $canonical.root $homePath) { 'user' } else { 'project' })
          skillsDir = $canonical.skillsDir; dataDir = $canonical.dataDir; kind = 'canonical'; target = $null
          dataDirKind = $(if (Test-Dir $canonical.dataDir) { 'dir' } else { 'missing' }); dataIsSkill = $false; valid = $true
        })
    }
  }
  $links = @($installs | Where-Object { $_.kind -eq 'link' })
  $copies = @($installs | Where-Object { ($_.kind -eq 'copy' -or $_.kind -eq 'data') -and $_.dataDirKind -ne 'skill' })

  $primary = $null
  $primaryScope = $null
  if ($canonical) {
    $primary = $canonical.dataDir
    $primaryScope = $(if (Test-Under $canonical.root $homePath) { 'user' } else { 'project' })
  } else {
    $chosen = $null
    if ($AgentRoot) { $chosen = @($copies | Where-Object { $_.base -eq $AgentRoot }) | Select-Object -First 1 }
    if (-not $chosen) { $chosen = @($copies | Where-Object { $_.scope -eq 'project' }) | Select-Object -First 1 }
    if (-not $chosen) { $chosen = @($copies) | Select-Object -First 1 }
    if ($chosen) { $primary = $chosen.dataDir; $primaryScope = $chosen.scope }
  }

  $linkCount = $links.Count
  $copyCount = $copies.Count
  $mode = if ($linkCount -gt 0 -and $copyCount -gt 0) { 'mixed' } elseif ($linkCount -gt 0) { 'link' } elseif ($copyCount -gt 0) { 'copy' } else { 'none' }

  $allDataDirs = New-Object System.Collections.Generic.List[string]
  $seen = New-Object System.Collections.Generic.HashSet[string]
  if ($primary) { if ($seen.Add((Path-Key $primary))) { $allDataDirs.Add($primary) } }
  foreach ($inst in $installs) {
    if ($inst.dataDirKind -eq 'skill') { continue }
    if ($seen.Add((Path-Key $inst.dataDir))) { $allDataDirs.Add($inst.dataDir) }
  }

  $syncTargets = New-Object System.Collections.Generic.List[string]
  if ($primary) { $syncTargets.Add($primary) }
  foreach ($inst in $copies) {
    if (-not $primary -or -not (Same-Path $inst.dataDir $primary)) { $syncTargets.Add($inst.dataDir) }
  }

  $mirrorLinks = New-Object System.Collections.Generic.List[string]
  foreach ($l in $links) {
    if (-not $primary -or -not (Same-Path $l.dataDir $primary)) { $mirrorLinks.Add($l.dataDir) }
  }

  $installsOut = New-Object System.Collections.Generic.List[object]
  foreach ($inst in $installs) {
    $installsOut.Add([ordered]@{
        base = $inst.base; root = $inst.root; scope = $inst.scope; kind = $inst.kind
        skillsDir = $inst.skillsDir; dataDir = $inst.dataDir; dataDirKind = $inst.dataDirKind; valid = $inst.valid
      })
  }

  return [ordered]@{
    ok = $true; command = 'resolve'; skill = $Skill; projectRoot = $projectRoot; home = $homePath
    homeScanned = $homeScanned; mode = $mode; primary = $primary; primaryScope = $primaryScope
    canonicalRoot = $(if ($canonical) { $canonical.root } else { $null })
    installs = $installsOut; dataDirs = $allDataDirs; syncTargets = $syncTargets; mirrorLinks = $mirrorLinks
    warnings = $warnings; conflicts = (New-Object System.Collections.Generic.List[object])
    actions = [ordered]@{
      created = (New-Object System.Collections.Generic.List[string]); updated = (New-Object System.Collections.Generic.List[string])
      skipped = (New-Object System.Collections.Generic.List[string]); planned = (New-Object System.Collections.Generic.List[string])
    }
    files = (New-Object System.Collections.Generic.List[object])
  }
}

# ---------------------------------------------------------------- operations

function Add-GitignoreEntry([string]$Root, [string]$Skill, [bool]$DryRun, $Actions) {
  $file = Join-P $Root '.gitignore'
  $entry = "/$Skill/*"
  $legacy1 = "/$Skill/"
  $legacy2 = "/$Skill"
  $current = $null
  if (Test-Ex $file) { try { $current = [IO.File]::ReadAllText($file) } catch { $current = $null } }
  $lines = @()
  if ($null -ne $current) { $lines = @($current -split "\r?\n" | ForEach-Object { $_.Trim() }) }
  if ($lines -contains $entry) { $Actions.skipped.Add($file); return }
  $hasLegacy = ($lines -contains $legacy1) -or ($lines -contains $legacy2)
  if ($hasLegacy) {
    $parts = [regex]::Split($current, '(?<=\n)')
    $next = ($parts | ForEach-Object {
        $line = $_
        $bare = $line.TrimEnd("`r", "`n")
        if (($bare.Trim() -eq $legacy1) -or ($bare.Trim() -eq $legacy2)) {
          $eol = if ($line.EndsWith("`r`n")) { "`r`n" } elseif ($line.EndsWith("`n")) { "`n" } else { "" }
          $entry + $eol
        } else { $line }
      }) -join ''
  } else {
    $prefix = ''
    if ($null -ne $current -and $current.Length -gt 0) { $prefix = if ($current.EndsWith("`n")) { $current } else { $current + "`n" } }
    $next = $prefix + $entry + "`n"
  }
  if ($DryRun) { $Actions.planned.Add($file); return }
  [IO.File]::WriteAllText($file, $next, $script:Utf8)
  if ($null -eq $current) { $Actions.created.Add($file) } else { $Actions.updated.Add($file) }
}

function Add-DataLink([string]$LinkPath, [string]$Target, [bool]$DryRun, $Actions, $Conflicts) {
  if (Test-Ex $LinkPath) {
    if ((Test-Link $LinkPath) -and (Same-Path (Get-Real $LinkPath) $Target)) { $Actions.skipped.Add($LinkPath); return }
    $Conflicts.Add([ordered]@{ path = $LinkPath; reason = 'existing path is not the expected link; left untouched' })
    return
  }
  $parent = Split-Path -Parent $LinkPath
  if (-not (Test-Dir $parent)) {
    $Conflicts.Add([ordered]@{ path = $LinkPath; reason = 'agent base directory does not exist; not created' })
    return
  }
  if ($DryRun) { $Actions.planned.Add($LinkPath); return }
  if ($script:Win) {
    New-Item -ItemType Junction -Path $LinkPath -Target $Target -ErrorAction Stop | Out-Null
  } else {
    New-Item -ItemType SymbolicLink -Path $LinkPath -Target $Target -ErrorAction Stop | Out-Null
  }
  $Actions.created.Add($LinkPath)
}

function Invoke-Init($Topo, [string]$Skill, [bool]$DryRun) {
  $result = [ordered]@{}
  foreach ($k in $Topo.Keys) { $result[$k] = $Topo[$k] }
  $result.command = 'init'
  $result.dryRun = $DryRun
  $actions = [ordered]@{
    created = (New-Object System.Collections.Generic.List[string]); updated = (New-Object System.Collections.Generic.List[string])
    skipped = (New-Object System.Collections.Generic.List[string]); planned = (New-Object System.Collections.Generic.List[string])
  }
  $conflicts = New-Object System.Collections.Generic.List[object]
  $primary = $Topo.primary
  if (-not $primary) {
    $result.ok = $false
    $result.warnings.Add('no installation found; ask the user for a data directory')
    return $result
  }
  if (-not (Test-Dir $primary)) {
    if ($DryRun) { $actions.planned.Add($primary) }
    else { New-Item -ItemType Directory -Force -Path $primary | Out-Null; $actions.created.Add($primary) }
  } else { $actions.skipped.Add($primary) }

  foreach ($target in $Topo.syncTargets) {
    if (Same-Path $target $primary) { continue }
    if (Test-Dir $target) { $actions.skipped.Add($target); continue }
    if ($DryRun) { $actions.planned.Add($target) }
    else { New-Item -ItemType Directory -Force -Path $target | Out-Null; $actions.created.Add($target) }
  }

  foreach ($linkPath in $Topo.mirrorLinks) { Add-DataLink $linkPath $primary $DryRun $actions $conflicts }

  $roots = New-Object System.Collections.Generic.HashSet[string]
  foreach ($inst in $Topo.installs) {
    if ($inst.dataDirKind -eq 'skill') { continue }
    if ($roots.Add((Path-Key $inst.root))) { Add-GitignoreEntry $inst.root $Skill $DryRun $actions }
  }

  $result.actions = $actions
  $result.conflicts = $conflicts
  $result.ok = ($conflicts.Count -eq 0)
  return $result
}

function Get-DataFiles([string]$Dir) {
  $map = [ordered]@{}
  $card = Join-P $Dir 'project-context.md'
  if (Test-Ex $card) { $map['project-context.md'] = [ordered]@{ path = $card; hash = (Get-HashHex $card); size = (Get-Item -LiteralPath $card -Force).Length } }
  $progress = Join-P $Dir 'progress'
  foreach ($name in (Get-ChildFileNames $progress)) {
    if (-not $name.EndsWith('.md')) { continue }
    $file = Join-P $progress $name
    $map["progress/$name"] = [ordered]@{ path = $file; hash = (Get-HashHex $file); size = (Get-Item -LiteralPath $file -Force).Length }
  }
  return $map
}

function Invoke-Sync($Topo, [string]$Skill, [string]$ExplicitPrimary, [string[]]$ExplicitMirrors, [string]$Mode, [bool]$DryRun) {
  $result = [ordered]@{}
  foreach ($k in $Topo.Keys) { $result[$k] = $Topo[$k] }
  $result.command = 'sync'
  $result.dryRun = $DryRun
  $primary = if ($ExplicitPrimary) { To-Posix ([IO.Path]::GetFullPath($ExplicitPrimary)) } else { $Topo.primary }
  $mirrors = New-Object System.Collections.Generic.List[string]
  if ($ExplicitMirrors.Count -gt 0) {
    foreach ($m in $ExplicitMirrors) { $mirrors.Add((To-Posix ([IO.Path]::GetFullPath($m)))) }
  } else {
    foreach ($d in $Topo.syncTargets) { if (-not $primary -or -not (Same-Path $d $primary)) { $mirrors.Add($d) } }
  }
  if (-not $primary) {
    $result.ok = $false
    $result.warnings.Add('no primary data directory; run resolve/init or pass --primary')
    return $result
  }
  $dirs = New-Object System.Collections.Generic.List[string]
  $dirs.Add($primary)
  foreach ($m in $mirrors) { if (-not (Same-Path $m $primary)) { $dirs.Add($m) } }
  if ($dirs.Count -lt 2) {
    $result.warnings.Add('single data directory; nothing to sync')
    $result.primary = $primary
    return $result
  }

  $snap = @{}
  foreach ($d in $dirs) { $snap[(Path-Key $d)] = Get-DataFiles $d }
  $rels = New-Object System.Collections.Generic.SortedSet[string]
  foreach ($d in $dirs) { foreach ($rel in $snap[(Path-Key $d)].Keys) { [void]$rels.Add($rel) } }

  $actions = [ordered]@{
    created = (New-Object System.Collections.Generic.List[string]); updated = (New-Object System.Collections.Generic.List[string])
    skipped = (New-Object System.Collections.Generic.List[string]); planned = (New-Object System.Collections.Generic.List[string])
  }
  $conflicts = New-Object System.Collections.Generic.List[object]
  $primaryKey = Path-Key $primary

  foreach ($rel in $rels) {
    $pmap = $snap[$primaryKey]
    $primaryEntry = $null
    if ($pmap.Contains($rel)) { $primaryEntry = $pmap[$rel] }

    if ($Mode -ne 'push' -and -not $primaryEntry) {
      $have = @()
      foreach ($d in $dirs) {
        if ((Path-Key $d) -eq $primaryKey) { continue }
        $m = $snap[(Path-Key $d)]
        if ($m.Contains($rel)) { $have += , @{ dir = $d; entry = $m[$rel] } }
      }
      if ($have.Count -gt 0) {
        $hashes = @($have | ForEach-Object { $_.entry.hash } | Sort-Object -Unique)
        if ($hashes.Count -gt 1) {
          $conflicts.Add([ordered]@{ file = $rel; reason = 'mirrors disagree while primary is missing'; mirrors = @($have | ForEach-Object { $_.dir }) })
        } else {
          $src = $have[0].entry
          if ($DryRun) { $actions.planned.Add("pull $rel -> $primary") }
          else {
            $target = Join-P (Split-Path -Parent (Join-P $primary $rel)) (Split-Path -Leaf (Join-P $primary $rel))
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $target) | Out-Null
            Copy-Item -LiteralPath $src.path -Destination $target -Force
            $pmap[$rel] = [ordered]@{ path = $target; hash = $src.hash; size = $src.size }
            $actions.created.Add("$rel -> $primary")
          }
          $primaryEntry = $pmap[$rel]
        }
      }
    }

    if ($Mode -ne 'pull' -and $primaryEntry) {
      foreach ($d in $dirs) {
        if ((Path-Key $d) -eq $primaryKey) { continue }
        $m = $snap[(Path-Key $d)]
        if (-not $m.Contains($rel)) {
          if ($DryRun) { $actions.planned.Add("push $rel -> $d") }
          else {
            $dest = Join-P $d $rel
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null
            Copy-Item -LiteralPath $primaryEntry.path -Destination $dest -Force
            $actions.created.Add("$rel -> $d")
          }
        } elseif ($m[$rel].hash -ne $primaryEntry.hash) {
          $conflicts.Add([ordered]@{
              file = $rel; reason = 'both sides changed'; primary = $primary; primaryHash = $primaryEntry.hash.Substring(0, 12)
              mirror = $d; mirrorHash = $m[$rel].hash.Substring(0, 12)
            })
        } else {
          $actions.skipped.Add("$rel @ $d")
        }
      }
    }
  }

  $result.primary = $primary
  $result.mirrors = $dirs.GetRange(1, $dirs.Count - 1)
  $result.actions = $actions
  $result.conflicts = $conflicts
  $result.ok = ($conflicts.Count -eq 0)
  return $result
}

function Invoke-Status($Topo) {
  $result = [ordered]@{}
  foreach ($k in $Topo.Keys) { $result[$k] = $Topo[$k] }
  $result.command = 'status'
  $files = New-Object System.Collections.Generic.List[object]
  foreach ($dir in $Topo.dataDirs) {
    $map = Get-DataFiles $dir
    foreach ($rel in $map.Keys) {
      $files.Add([ordered]@{ dir = $dir; path = $rel; hash = $map[$rel].hash; size = $map[$rel].size })
    }
  }
  $result.files = $files
  return $result
}

# ---------------------------------------------------------------- JSON output

function ConvertTo-JsonString([string]$s) {
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.Append('"')
  foreach ($ch in $s.ToCharArray()) {
    switch ($ch) {
      '"' { [void]$sb.Append('\"'); continue }
      '\' { [void]$sb.Append('\\'); continue }
      "`n" { [void]$sb.Append('\n'); continue }
      "`r" { [void]$sb.Append('\r'); continue }
      "`t" { [void]$sb.Append('\t'); continue }
      default { [void]$sb.Append($ch) }
    }
  }
  [void]$sb.Append('"')
  return $sb.ToString()
}

function ConvertTo-JsonText($Value, [int]$Indent = 0) {
  $pad = ' ' * $Indent
  $pad2 = ' ' * ($Indent + 2)
  if ($null -eq $Value) { return 'null' }
  if ($Value -is [bool]) { if ($Value) { return 'true' } else { return 'false' } }
  if ($Value -is [int] -or $Value -is [long] -or $Value -is [double] -or $Value -is [decimal]) { return $Value.ToString([Globalization.CultureInfo]::InvariantCulture) }
  if ($Value -is [string]) { return (ConvertTo-JsonString $Value) }
  if ($Value -is [System.Collections.IDictionary]) {
    if ($Value.Count -eq 0) { return '{}' }
    $parts = New-Object System.Collections.Generic.List[string]
    foreach ($k in $Value.Keys) {
      $parts.Add($pad2 + (ConvertTo-JsonString ([string]$k)) + ': ' + (ConvertTo-JsonText $Value[$k] ($Indent + 2)))
    }
    return "{`n" + ($parts -join ",`n") + "`n$pad}"
  }
  if ($Value -is [System.Collections.IEnumerable]) {
    $items = New-Object System.Collections.Generic.List[object]
    foreach ($item in $Value) { [void]$items.Add($item) }
    if ($items.Count -eq 0) { return '[]' }
    $parts = New-Object System.Collections.Generic.List[string]
    foreach ($item in $items) { $parts.Add($pad2 + (ConvertTo-JsonText $item ($Indent + 2))) }
    return "[`n" + ($parts -join ",`n") + "`n$pad]"
  }
  $props = $Value.PSObject.Properties
  if ($props.Count -eq 0) { return '{}' }
  $parts = New-Object System.Collections.Generic.List[string]
  foreach ($p in $props) { $parts.Add($pad2 + (ConvertTo-JsonString $p.Name) + ': ' + (ConvertTo-JsonText $p.Value ($Indent + 2))) }
  return "{`n" + ($parts -join ",`n") + "`n$pad}"
}

# ---------------------------------------------------------------- entry point

$argv = @($args)
$opts = [ordered]@{
  command = 'resolve'; project = (Get-Location).Path; skill = 'issue-triage'; agentRoot = $null
  extraBases = @(); home = $HOME; noHome = $false; primary = $null; mirrors = @(); mode = 'both'; dryRun = $false
}
if ($argv.Count -gt 0 -and -not $argv[0].StartsWith('-')) { $opts.command = $argv[0]; $argv = @($argv | Select-Object -Skip 1) }

for ($i = 0; $i -lt $argv.Count; $i++) {
  $a = [string]$argv[$i]
  switch ($a) {
    '--project' { $i++; $opts.project = [string]$argv[$i] }
    '--skill' { $i++; $opts.skill = [string]$argv[$i] }
    '--agent-root' { $i++; $opts.agentRoot = [string]$argv[$i] }
    '--extra-base' { $i++; $opts.extraBases += [string]$argv[$i] }
    '--home' { $i++; $opts.home = [string]$argv[$i] }
    '--no-home' { $opts.noHome = $true }
    '--primary' { $i++; $opts.primary = [string]$argv[$i] }
    '--mirror' { $i++; $opts.mirrors += [string]$argv[$i] }
    '--mode' { $i++; $opts.mode = [string]$argv[$i] }
    '--dry-run' { $opts.dryRun = $true }
    '--help' { $opts.command = 'help' }
    '-h' { $opts.command = 'help' }
    default {
      Write-Output (ConvertTo-JsonText ([ordered]@{ ok = $false; command = 'unknown'; error = "unknown argument: $a" }))
      exit 1
    }
  }
}

if ($opts.command -eq 'help') {
  Write-Output 'triage-data.ps1 <resolve|init|sync|status> [options]'
  Write-Output '  --project <dir>      project root (default: cwd)'
  Write-Output '  --skill <name>       skill name (default: issue-triage)'
  Write-Output '  --agent-root <base>  base dir of the running agent, e.g. .codebuddy'
  Write-Output '  --extra-base <name>  additional base dir to inspect (repeatable)'
  Write-Output '  --home <dir>         override the user home directory'
  Write-Output '  --no-home            never scan the user home directory'
  Write-Output '  --primary <dir>      sync: explicit primary data directory'
  Write-Output '  --mirror <dir>       sync: explicit mirror data directory (repeatable)'
  Write-Output '  --mode <pull|push|both>  sync direction (default: both)'
  Write-Output '  --dry-run            init/sync: report actions without writing'
  exit 0
}

if (@('resolve', 'init', 'sync', 'status') -notcontains $opts.command) {
  Write-Output (ConvertTo-JsonText ([ordered]@{ ok = $false; command = 'unknown'; error = "unknown command: $($opts.command)" }))
  exit 1
}
if (@('pull', 'push', 'both') -notcontains $opts.mode) {
  Write-Output (ConvertTo-JsonText ([ordered]@{ ok = $false; command = $opts.command; error = "invalid --mode: $($opts.mode)" }))
  exit 1
}

try {
  $topo = Get-Topology $opts.project $opts.skill $opts.agentRoot $opts.extraBases $opts.home $opts.noHome
  $result = switch ($opts.command) {
    'resolve' { $topo }
    'init' { Invoke-Init $topo $opts.skill $opts.dryRun }
    'sync' { Invoke-Sync $topo $opts.skill $opts.primary $opts.mirrors $opts.mode $opts.dryRun }
    'status' { Invoke-Status $topo }
  }
  Write-Output (ConvertTo-JsonText $result)
  if ($result.conflicts -and $result.conflicts.Count -gt 0) { exit 2 }
  exit 0
} catch {
  Write-Output (ConvertTo-JsonText ([ordered]@{ ok = $false; command = $opts.command; error = $_.Exception.Message }))
  exit 1
}
