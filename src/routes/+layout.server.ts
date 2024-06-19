import type { PageServerLoad, PageServerLoadEvent } from './$types';

import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';
import { settingsStore } from '$lib/base/Util/AppState';
import { dev } from '$app/environment';

export const load: PageServerLoad = (async ({ cookies, request }: PageServerLoadEvent) => {
    settingsStore.loadCookies(cookies);
    const projects = await ProjectLoader.loadAvailableProjects();
    return {
        projects,
        requestUrl: request.url
    };
}) satisfies PageServerLoad;

// Only use SSR in production, to avoid flickery hot reloads in dev
export const ssr = !dev;
