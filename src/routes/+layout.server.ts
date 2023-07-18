import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';
import ConfigLoader from '$lib/base/ConfigLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    const config = await ConfigLoader.loadSketchbookConfig();
    console.log(config);
    return { projects };
}) satisfies PageServerLoad;
