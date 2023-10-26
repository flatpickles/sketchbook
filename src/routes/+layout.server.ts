import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';
import { settingsStore } from '$lib/base/Util/AppState';

export const load: PageServerLoad = (async ({ cookies, request }) => {
    settingsStore.loadCookies(cookies);
    const projects = await ProjectLoader.loadAvailableProjects();
    return {
        projects,
        requestUrl: request.url
    };
}) satisfies PageServerLoad;
