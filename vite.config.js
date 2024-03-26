import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// config options
export default {
    // Complete documentation of Vite configuration on
    //      https://vitejs.dev/config/

    // Change to the name of your repository
    // According to https://vitejs.dev/guide/static-deploy.html 
    base: '/polimi-webgis-class-2024/', 

    publicDir: "public",

    // Options for the build command
    build: {
        // The name of the folder to which the build is stored.
        // As the folder that github pages expects is /docs, we export to /docs folder.
        outDir: 'docs',

        // This builds the dependencies and bundles using the different imports from the pages.
        // It uses index.html as the main entrypoint.
        // Also adds every html file inside the /pages folder.
        // Further pages must be added to the configuration accordingly.
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
        },
    }
  }