import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const { projects } = await parent();

    // Redirect to the first project
    // todo: handle no projects; sorting; etc
    const projectKeys = Object.keys(projects);
    if (projectKeys.length > 0) {
        const firstProject = projectKeys[0];
        throw redirect(307, `/${firstProject}`);
    }
}) satisfies PageServerLoad;
