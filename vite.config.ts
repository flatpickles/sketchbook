import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [sveltekit()],
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
    }
});
