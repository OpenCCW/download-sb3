import { defineConfig } from 'vite'
import { OutputAsset } from 'rolldown';

export default defineConfig({
    base: './',
    appType: 'mpa',
    input: [
        "index.html",
        "sb3.html",
    ],
    build: {
        target: 'es2021',
        modulePreload: {
            polyfill: false,
        },
        sourcemap: true,
    },
    plugins: [
        {
            name: 'prefetch-sb3-js',
            enforce: 'post',
            generateBundle(_options, bundle) {
                const sb3File = bundle['sb3.html'] as OutputAsset;

                const scriptRegex = /<script\s+[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*>/;
                const match = (sb3File.source as string).match(scriptRegex);
                if (!match) return;
                const src = match[1];

                const indexFile = bundle['index.html'] as OutputAsset;

                const linkTag = `<link rel="prefetch" href="${src}">`;
                indexFile.source = (indexFile.source as string).replace('</head>', `${linkTag}</head>`);
            },
        }
    ],
})
