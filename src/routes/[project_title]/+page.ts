import type { PageLoad } from './$types';

export const load = (async ({ params, parent }) => {
    const { loader } = await parent();
    const title = params.project_title ?? 'default';
    console.log(loader);
    return {
        post: {
            title: `Title for ${title} goes here`,
            content: `Content for ${title} goes here`
        }
    };
}) satisfies PageLoad;
