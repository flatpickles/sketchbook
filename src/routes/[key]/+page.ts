import ProjectLoader, { type ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
    const projectKey = params.key;

    // The project tuple will not be fully available in SSR
    const projectTuplePartial = await ProjectLoader.loadProject(projectKey);
    if (!projectKey || !projectTuplePartial || !projectTuplePartial.config) {
        throw error(404, `No project exists with key "${projectKey}"`);
    }

    // Cast a proper ProjectTuple if all fields are defined
    let projectTuple: ProjectTuple | undefined;
    if (
        projectTuplePartial.key &&
        projectTuplePartial.config &&
        projectTuplePartial.project &&
        projectTuplePartial.params &&
        projectTuplePartial.presets
    ) {
        projectTuple = projectTuplePartial as ProjectTuple;
    }

    return {
        projectKey,
        projectConfig: projectTuplePartial.config,
        projectTuple
    };
}) satisfies PageLoad;
