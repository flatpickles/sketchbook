import type { PageLoad } from './$types';

export const load: PageLoad = (() => {
    const projects = import.meta.glob('/src/art/**/*.ts');
    console.log(projects);
    for (const path in projects) {
        // Project files are named the same as their containing folder
        const pathComponents = path.split('/');
        const name = pathComponents.pop()?.split('.')[0];
        if (name && pathComponents.indexOf(name) < 0) continue;

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
