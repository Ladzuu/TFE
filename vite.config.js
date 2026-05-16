import { resolve } from 'path'
import restart from 'vite-plugin-restart'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default {
    base: './', // Base public path when served in production
    root: 'src/', // Sources files (typically where index.html is)
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true, // Add sourcemap
        rollupOptions: // Add multiple HTML pages
        {
            input:
            {
                main: resolve(__dirname, 'src/index.html'),
                map: resolve(__dirname, 'src/map.html'),
                temple: resolve(__dirname, 'src/temple.html'),
                island: resolve(__dirname, 'src/island.html'),
                village: resolve(__dirname, 'src/village.html')
            }
        }
    },
    plugins:
    [
        restart({ restart: [ '../static/**', ] }), // Restart server on static file change
        // viteStaticCopy({
        //     targets: [
        //         { src: '../src/**/*', dest: '' }
        //     ]
        // })
    ],
}