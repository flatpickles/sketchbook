import { config } from '../config/settings';
import ProjectPresentation, { SortOrder } from '../lib/base/ProjectLoading/ProjectPresentation';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent, cookies }) => {
    const { projects } = await parent();

    // Load settings from cookies, or use defaults
    const cookieSortOrder = cookies.get('settings_projectSortOrder')?.replaceAll('"', '');
    const cookieExperimentsEnabled = cookies.get('settings_showExperiments');
    const projectSortOrder = cookieSortOrder
        ? (cookieSortOrder as SortOrder)
        : config.projectSortOrder;
    const experimentsEnabled = cookieExperimentsEnabled
        ? cookieExperimentsEnabled === 'true'
        : config.showExperiments;

    // Get presentation order for project keys, so we can navigate to the first one
    const presentationOrder = ProjectPresentation.presentedKeys(
        projects,
        projectSortOrder,
        experimentsEnabled
    );

    // If there are no projects, throw an error (for now)
    if (presentationOrder.length === 0) throw new Error('No projects found');

    // Redirect to the first project
    const firstProject = presentationOrder[0];
    throw redirect(307, `/${firstProject}`);
}) satisfies PageServerLoad;
