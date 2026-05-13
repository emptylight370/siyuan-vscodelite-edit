#!/usr/bin/env pwsh
#MISE description="Generate changelog"

$version = (Get-Content theme.json | ConvertFrom-Json).version
git cliff -t $version
prettier -w changelog.md
git add changelog.md