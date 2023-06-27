import type { PageLoad } from './$types';

import { Loader } from '$lib/base/Loader';

export const load: PageLoad = (() => {
    console.log(Loader.projects);
    return {
        post: {}
    };
}) satisfies PageLoad;
