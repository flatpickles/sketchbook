import { config } from '../config/settings';
import ProjectPresentation, { SortOrder } from '../lib/base/ProjectLoading/ProjectPresentation';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import isbot from 'isbot';

export const load = (async ({ parent, cookies, request }) => {
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

    // Get the user agent and check if it's a bot
    const { headers } = request;
    const userAgent = headers.get('user-agent');
    const isBot = isbot(userAgent);

    // If there are projects, redirect to the first one
    if (presentationOrder.length !== 0 && !isBot) {
        const firstProject = presentationOrder[0];
        throw redirect(307, `/${firstProject}`);
    }
}) satisfies PageServerLoad;
