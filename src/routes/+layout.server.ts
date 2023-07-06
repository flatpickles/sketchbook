import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    return { projects };
}) satisfies PageServerLoad;
