import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import glslify from 'glslify';
import glsl from 'vite-plugin-glsl';

// List any dependencies here that you want to be pre-bundled. This avoids page reloads when loading
// projects that use these dependencies.
const bundleDeps = ['js-cookie', 'regl', 'p5'];

// viteGlslify is a lightweight Vite plugin that compiles GLSL files with glslify. It will compile
// any .vert, .frag, or .glsl files that include the string "#pragma glslify" in the file, and can
// work with shaders that are already transformed into importable JS by vite.
function viteGlslify() {
    return {
        name: 'vite-glslify',
        enforce: 'pre' as const,
        transform: async (code: string, id: string) => {
            const shaderFileMatcher = /\.(vert|frag|glsl)/g;
            if (shaderFileMatcher.test(id) && code.includes('#pragma glslify')) {
                // Match a couple different formats of parsed files
                if (code.startsWith('export default ')) {
                    code = code.replace('export default "', '').slice(0, -1);
                } else if (code.includes('export {\n')) {
                    const afterDef = code.split(/= "/)[1];
                    code = afterDef.split(/";\n/)[0];
                } else {
                    throw new Error(`Unexpected shader file format for ${id}: ${code}`);
                }
                // Translate escaped characters for glslify
                const glslifiedCode = glslify.compile(
                    code.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
                );
                // Return the compiled code as a default export
                return `export default ${JSON.stringify(glslifiedCode)}`;
            }
            return code;
        }
    };
}

export default defineConfig({
    plugins: [sveltekit(), glsl(), viteGlslify()],
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
    },

    // This is an attempted workaround for a bug in Vite that causes import errors for cached
    // chunks. See https://github.com/vitejs/vite/issues/11804. This may need to be revised.
    build: {
        rollupOptions: { output: { entryFileNames: '[name].js', chunkFileNames: '[name].js' } }
    }
});
