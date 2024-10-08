import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

import dtsPlugin from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

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
            }
        ],
        plugins: [
            nodeResolve({ browser: true }),
            typescript({ tsconfig: './tsconfig.json' }),
            commonjs(),
            shouldMin && terser({ compress: { drop_console: false } })
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: `dist/cjs/${indexFileName}`,
                format: 'cjs'
            }
        ],
        plugins: [
            nodeResolve(),
            typescript({ tsconfig: './tsconfig.json' }),
            peerDepsExternal()
        ]
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: `dist/esm/${indexFileName}`,
                format: 'esm'
            }
        ],
        plugins: [
            nodeResolve(),
            typescript({ tsconfig: './tsconfig.json' }),
            dtsPlugin(),
            peerDepsExternal()
        ]
    }
];
