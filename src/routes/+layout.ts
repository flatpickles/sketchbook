import type { PageLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';

export const load: PageLoad = (async () => {
    const loader = new ProjectLoader();
    const projects = await loader.loadAvailableProjects();
    console.log(projects);
    const project = await loader.loadProject('DemoProject');
    console.log(project);
    return {
        post: {}
    };
}) satisfies PageLoad;
