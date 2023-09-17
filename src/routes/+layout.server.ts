import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    return { projects };
}) satisfies PageServerLoad;

// Disable SSR for Sketchbook
// Stored param values use localStorage; with SSR we see a flash of the default values
export const ssr = false;
