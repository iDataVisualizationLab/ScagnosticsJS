import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'
export default {
    input: 'src/scripts/scagnostics.js',
    output:{
        file:'build/js/scagnostics.min.js',
        format: 'iife',
        sourcemap: 'inline',
    },
    plugins: [
        resolve(),
        commonJS({
            include: ['node_modules/**']
        })
    ]
};