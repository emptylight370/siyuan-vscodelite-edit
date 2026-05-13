#!/usr/bin/env pwsh
#MISE description="Generate changelog"

$version = (mise x jq -- jq -r .version plugin.json)
git cliff -t $version
prettier -w changelog.md
git add changelog.md