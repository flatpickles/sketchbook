import type { PageLoad } from './$types';

export const load = (({ params }) => {
	const name = params.name ?? 'default';
	return {
		post: {
			title: `Title for ${name} goes here`,
			content: `Content for ${name} goes here`
		}
	};
}) satisfies PageLoad;
