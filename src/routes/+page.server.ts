import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const test = await parent();
    console.log(test);
    // throw redirect(307, '/');
}) satisfies PageServerLoad;
