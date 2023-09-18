import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess({})],

    kit: {
        adapter: adapter(),
        alias: {
            $config: 'src/config',
        }
    },

    compilerOptions: {
        accessors: process.env.TEST
    }
};

export default config;
