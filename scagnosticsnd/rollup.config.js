import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs'

export default {
    input: 'src/scripts/scagnosticsnd.js',
    // input: 'src/scripts/outliagnosticsnd.js',
    // input: 'src/scripts/ndleaderbin.js',
    output: {
        file: 'build/js/scagnosticsnd.min.js',
        // file:'build/js/outliagnosticsnd.min.js',
        // file: 'build/js/ndleaderbin.min.js',
        format: 'iife',
        sourcemap: 'inline',
    },
    plugins: [
        resolve(),
        commonJS({
            include: ['node_modules/**']
        }),
    ]
};
