import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';

export const load: PageServerLoad = (async () => {
    const loader = new ProjectLoader();
    const projects = await loader.loadAvailableProjects();
    return { projects };
}) satisfies PageServerLoad;
