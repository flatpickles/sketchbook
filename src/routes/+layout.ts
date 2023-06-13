import type { PageLoad } from './$types';

export const load: PageLoad = (() => {
	const projects = import.meta.glob('../projects/*.ts');
	for (const path in projects) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		projects[path]().then((module: any) => {
			new module.default();
		});
	}

	return {
		post: {}
	};
}) satisfies PageLoad;
