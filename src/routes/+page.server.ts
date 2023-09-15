import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, cookies }) => {
    const { projects } = await parent();
    console.log(cookies.get('settings_projectSortOrder'));

    // Redirect to the first project
    // todo: handle no projects; sorting; etc
    const projectKeys = Object.keys(projects);
    if (projectKeys.length > 0) {
        const firstProject = projectKeys[0];
        throw redirect(307, `/${firstProject}`);
    }
}) satisfies PageServerLoad;
