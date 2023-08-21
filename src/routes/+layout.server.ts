import type { PageServerLoad } from './$types';

import ProjectLoader from '$lib/base/FileLoading/ProjectLoader';
import SketchbookConfigLoader from '$lib/base/FileLoading/SketchbookConfigLoader';

export const load: PageServerLoad = (async () => {
    const projects = await ProjectLoader.loadAvailableProjects();
    const sketchbook = await SketchbookConfigLoader.loadConfig();
    return { projects, sketchbook };
}) satisfies PageServerLoad;

// Disable SSR for Sketchbook
// Stored param values use localStorage; with SSR we see a flash of the default values
export const ssr = false;
