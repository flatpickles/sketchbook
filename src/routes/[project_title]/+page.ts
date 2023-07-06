import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    const title = params.project_title ?? 'default';
    return {
        post: {
            title: `Title for ${title} goes here`,
            content: `Content for ${title} goes here`
        }
    };
}) satisfies PageLoad;
