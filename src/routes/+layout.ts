import type { PageLoad } from './$types';

export const load: PageLoad = (() => {
	const projects = import.meta.glob('../projects/*.ts');
	for (const path in projects) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		projects[path]().then((module: any) => {
			const instance = new module.default();
			console.log(Object.getOwnPropertyNames(instance));
			instance.publicValue = 'new value';
			instance.logPublicValue();
		});
	}

	return {
		post: {}
	};
}) satisfies PageLoad;
