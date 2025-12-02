#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 读取theme.json中的版本号
const themeJsonPath = path.join(process.cwd(), "theme.json");
const themeContent = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
const themeVersion = themeContent.version;

// 读取defs.ts中的lastSeen值
const defsTsPath = path.join(process.cwd(), "src/ts/defs.ts");
const defsContent = fs.readFileSync(defsTsPath, "utf8");

// 使用正则表达式提取lastSeen的值
const lastSeenMatch = defsContent.match(/lastSeen:\s*["']([^"']+)["']/);

if (!lastSeenMatch) {
    console.info("❌ 错误：无法在defs.ts中找到lastSeen字段");
    process.exit(1);
}

const lastSeenVersion = lastSeenMatch[1];

// 比较两个版本号
if (themeVersion !== lastSeenVersion) {
    console.info(`❌ 版本号不匹配！`);
    console.info(`   theme.json 中的版本号: ${themeVersion}`);
    console.info(`   defs.ts 中的 lastSeen: ${lastSeenVersion}`);
    console.info("\n请确保两个版本号保持一致！");
    process.exit(1);
}

console.info("✅ 版本号检查通过");
process.exit();
