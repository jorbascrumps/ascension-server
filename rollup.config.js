import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'canvas.js',
    output: {
        file: 'build/dist.js',
        format: 'cjs'
    },
    plugins: [
        babel({
            exclude: '/node_modules/**'
        }),
        resolve({
            jsnext: true
        }),
        commonjs(),
    ]
}
