import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

inputs = {
    main: 'index.html',
        ...Object.fromEntries(
            globSync('pages/*.html').map(file => [
                // This remove `pages/` as well as the file extension from each
                // file, so e.g. src/nested/foo.js becomes nested/foo
                path.relative(
                    'pages',
                    file.slice(0, file.length - path.extname(file).length)
                ),
                // This expands the relative paths to absolute paths, so e.g.
                // src/nested/foo becomes /project/src/nested/foo.js
                fileURLToPath(new URL(file, import.meta.url))
            ])
        ),
        ...Object.fromEntries(
            globSync('assets/js/*.js').map(file => [
                // This remove `src/` as well as the file extension from each
                // file, so e.g. src/nested/foo.js becomes nested/foo
                path.relative(
                    'js',
                    file.slice(0, file.length - path.extname(file).length)
                ),
                // This expands the relative paths to absolute paths, so e.g.
                // src/nested/foo becomes /project/src/nested/foo.js
                fileURLToPath(new URL(file, import.meta.url))
            ])
        ),
}
console.log(inputs);

export default {
    // config options
    base: '/polimi-webgis-class-2024/',
    build: {
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: { 
                main: 'index.html',
                ...Object.fromEntries(
                    globSync('pages/*.html').map(file => [
                        // This remove `pages/` as well as the file extension from each
                        // file, so e.g. src/nested/foo.js becomes nested/foo
                        path.relative(
                            'pages',
                            file.slice(0, file.length - path.extname(file).length)
                        ),
                        // This expands the relative paths to absolute paths, so e.g.
                        // src/nested/foo becomes /project/src/nested/foo.js
                        fileURLToPath(new URL(file, import.meta.url))
                    ])
                ),
            },
            // output: {
            //     assetFileNames: "assets/[name][extname]",
            //     chunkFileNames: "[name].js",
            //     entryFileNames: "[name].js"
            // }
        },
    }
  }