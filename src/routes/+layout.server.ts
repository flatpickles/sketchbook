import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/FileLoading/ProjectLoader';
import SketchbookConfigLoader from '$lib/base/FileLoading/SketchbookConfigLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    const sketchbook = await SketchbookConfigLoader.loadConfig();
    return { projects, sketchbook };
}) satisfies PageServerLoad;
