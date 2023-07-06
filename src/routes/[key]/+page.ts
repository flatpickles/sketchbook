import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

import ProjectLoader from '$lib/base/ProjectLoader';

export const load = (async ({ params, parent }) => {
    // Collect details & validate
    const projectKey = params.key;
    const { projects } = await parent();
    const projectTuple = await ProjectLoader.loadProject(projectKey);
    if (!projectKey || !projects[projectKey] || !projectTuple) {
        throw error(404, `No project named "${projectKey}" exists!`);
    }
    return projectTuple;
}) satisfies PageLoad;
