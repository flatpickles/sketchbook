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
        environment: 'jsdom'
    },
    server: {
        fs: {
            allow: ['src/art']
        }
    }
});
