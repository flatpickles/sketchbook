import type { PageLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';

export const load: PageLoad = (async () => {
    const loader = new ProjectLoader();
    const projects = await loader.loadAvailableProjects();
    return { loader, projects };
}) satisfies PageLoad;
