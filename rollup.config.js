import typescript from '@rollup/plugin-typescript';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    input: resolve(__dirname, 'src/theme.ts'),
    output: {
        file: resolve(__dirname, './theme.js'),
        format: 'iife',          // 修改为 iife 格式
    },
    plugins: [
        typescript({
            tsconfig: resolve(__dirname, './tsconfig.json'),
        })
    ]
};