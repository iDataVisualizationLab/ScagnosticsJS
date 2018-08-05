import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'
export default {
    entry: 'src/scripts/scagnostics.js',
    dest: 'build/js/scagnostics.min.js',
    format: 'iife',
    sourceMap: 'inline',
    plugins: [
        resolve(),
        commonJS({
            include: 'node_modules/**'
        })
    ]
};