#!/usr/bin/env pwsh
#MISE description="Deploy to SiYuan workspace"

param (
  # 目标工作空间名称Target workspace name
  [string]$target,
  # 部署到所有工作空间Deploy to all workspaces
  [switch]$all
)

$source_dir = $env:MISE_CONFIG_ROOT

$workspaces = @(siyuan workspace list --format json | ConvertFrom-Json)

$current_workspace = siyuan workspace info --format json | ConvertFrom-Json

if ($workspaces.Count -le 0) {
  Write-Error -Message "SiYuan workspace not found!"
  exit 1
}

pnpm run clean
pnpm run build

# - 根目录：theme.*、readme*.md、*.png，排除 *.css.map / theme.scss / *.ts
# - sub、resources：镜像同步（先清空目标再复制），排除 *.css.map
function CopyToWorkspace([string]$source, [string]$target) {
  if (-not (Test-Path $target)) {
    New-Item -ItemType Directory -Path $target -Force | Out-Null
  }
  # 根目录文件（排除构建源文件与 sourcemap）
  Copy-Item -Path (Join-Path $source "theme.*") -Destination $target -Exclude "*.css.map", "theme.scss", "*.ts" -Force
  Copy-Item -Path (Join-Path $source "readme*.md") -Destination $target -Force
  Copy-Item -Path (Join-Path $source "*.png") -Destination $target -Force
  # sub 与 resources 镜像同步
  foreach ($dir in @("sub", "resources")) {
    $dest = Join-Path $target $dir
    if (Test-Path $dest) {
      Remove-Item -Path $dest -Recurse -Force
    }
    Copy-Item -Path (Join-Path $source $dir) -Destination $target -Recurse -Exclude "*.css.map" -Force
  }
}

if ($all) {
  foreach ($item in $workspaces) {
    $target_dir = Join-Path $item.path "data/themes/siyuan-vscodelite-edit"
    CopyToWorkspace $source_dir $target_dir
    Write-Output "Deploy to workspace $($item.name)"
  }
}
else {
  if ($target) {
    $workspace = $workspaces | Where-Object { $_.name -eq $target }
    if (-not $workspace) {
      Write-Error -Message "Workspace '$target' not found!"
      exit 1
    }
  }
  else {
    # workspace info 接口没有 name 字段，按 path 反查列表中的完整条目
    $workspace = $workspaces | Where-Object { $_.path -eq $current_workspace.path }
    if (-not $workspace) {
      Write-Error -Message "Current workspace not found in workspace list!"
      exit 1
    }
  }
  $target_dir = Join-Path $workspace.path "data/themes/siyuan-vscodelite-edit"
  CopyToWorkspace $source_dir $target_dir
  Write-Output "Deploy to workspace $($workspace.name)"
}

try {
  $kernel = Get-Process -Name SiYuan-Kernel
  $net = Get-NetTCPConnection -OwningProcess $kernel.Id -RemotePort 0 -LocalAddress 127.0.0.1
  foreach ($conn in $net) {
    $workspace = Invoke-WebRequest -Uri "http://127.0.0.1:$($conn.LocalPort)/api/system/getWorkspaceInfo" -Method Post | ConvertFrom-Json
    if (!$all && $workspace.data.workspaceDir -eq $workspace.path) {
      $res = Invoke-WebRequest -Uri "http://127.0.0.1:$($conn.LocalPort)/api/ui/reloadUI" -Method Post
      if ($res.StatusCode -eq 200) {
        Write-Output "刷新$($workspace.name)界面完成"
      }
      else {
        Write-Output "刷新$($workspace.name)界面失败"
      }
      exit 0
    }
    elseif ($all) {
      if ($conn.LocalPort -ne 6806) {
        $res = Invoke-WebRequest -Uri "http://127.0.0.1:$($conn.LocalPort)/api/ui/reloadUI" -Method Post
        if ($res.StatusCode -eq 200) {
          Write-Output "刷新界面完成"
        }
        else {
          Write-Output "刷新界面失败"
        }
      }
    }
  }
}
catch {
  Write-Output "刷新界面失败"
}
