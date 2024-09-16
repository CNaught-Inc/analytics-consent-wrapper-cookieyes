import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const env = process.env.NODE_ENV || 'local';
const shouldMin = env === 'production' || env === 'stage';
const indexFileName = 'index.js';

export default [
    {
        input: 'src/index.umd.ts',
        output: [
            {
                name: 'AnalyticsCookieYes',
                file: `dist/umd/${indexFileName}`,
                format: 'umd'
            },
            {
                file: `dist/global/${indexFileName}`,
                format: 'iife'
            },
            {
                file: `dist/cjs/${indexFileName}`,
                format: 'cjs'
            },
            {
                file: `dist/es/${indexFileName}`,
                format: 'es'
            }
        ],
        plugins: [
            resolve({ browser: true }),
            typescript({ tsconfig: './tsconfig.json' }),
            // commonjs(),
            shouldMin && terser()
        ]
    }
];
