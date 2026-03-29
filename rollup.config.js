import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dirname, resolve } from "path";
import { defineConfig } from "rollup";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    input: resolve(__dirname, "src/ts/theme.ts"),
    output: {
        file: resolve(__dirname, "theme.js"),
        format: "iife", // 修改为 iife 格式
        compact: true, // 压缩输出
    },
    plugins: [
        typescript({
            removeComments: true, // 移除注释
        }),
        terser(), // 压缩输出
    ],
});
