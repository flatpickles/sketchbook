import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import fsp from 'node:fs/promises';
import glslify from 'glslify';

// List any dependencies here that you want to be pre-bundled. This avoids page reloads when loading
// projects that use these dependencies.
const bundleDeps = ['regl', 'p5'];

// viteGlslify is a lightweight Vite plugin that compiles GLSL files with glslify. It will
// automatically compile any .vert, .frag, or .glsl files that are imported. Doing this in 'load'
// instead of 'transform' enables importing these with the 'raw' specifier, which is useful for
// importing shader files as strings. Reference: https://github.com/vitejs/vite/issues/12856
function viteGlslify() {
    return {
        name: 'vite-glslify',
        enforce: 'pre' as const,
        load: async (id: string) => {
            const shaderFileMatcher = /\.(vert|frag|glsl)/g;
            if (shaderFileMatcher.test(id)) {
                const code = await fsp.readFile(id.split('?')[0], 'utf-8');
                const glslifiedCode = glslify.compile(code);
                return `export default ${JSON.stringify(glslifiedCode)}`;
            }
        }
    };
}

export default defineConfig({
    plugins: [sveltekit(), viteGlslify()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "src/config/theme.scss" as *;'
            }
        }
    },
    test: {
        include: [
            'tests/unit/**/*.{test,spec}.{js,ts}',
            'tests/component/**/*.{test,spec}.{js,ts}'
        ],
        environment: 'jsdom',

        // https://stackoverflow.com/a/76615709/280404
        alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }]
    },
    server: {
        fs: {
            allow: ['src/art']
        }
    },
    optimizeDeps: {
        include: bundleDeps
    }
});
