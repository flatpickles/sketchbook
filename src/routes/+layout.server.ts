import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';
import { settingsStore } from '$lib/base/Util/AppState';

export const load: PageServerLoad = (async ({ cookies }) => {
    settingsStore.loadCookies(cookies);
    const projects = await ProjectLoader.loadAvailableProjects();
    return { projects };
}) satisfies PageServerLoad;
