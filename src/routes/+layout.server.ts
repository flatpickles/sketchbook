import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/ProjectLoader';
import ConfigLoader from '$lib/base/ConfigLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    const sketchbook = await ConfigLoader.loadSketchbookConfig();
    return { projects, sketchbook };
}) satisfies PageServerLoad;
