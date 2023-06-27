import Project from './Project';
import ProjectConfig from './ProjectConfig';

interface ProjectData {
    config: ProjectConfig;
    classImport: () => Promise<unknown>;
}

export class SketchbookLoader {
    public projects: Record<string, ProjectData> = {};
    #projectImports: Record<string, () => Promise<unknown>> = {};

    public constructor() {
        this.#loadProjectData();
    }

    #loadProjectData(): void {
        // Load project config data
        const configFiles = import.meta.glob('/src/art/*/config.json');
        for (const path in configFiles) {
            // Project keys are the names of the containing folders
            const pathComponents = path.split('/');
            const projectKey = pathComponents.pop()?.split('.')[0];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');
            configFiles[path]().then((module: unknown) => {
                const configObject = ProjectConfig.from(module);
                // config.project.date = new Date(config.project.date); // Convert date string to Date object
                console.log(configObject);

                // TODO NEXT: sort out data references here;
                // collect and keep track of modules somehow
                // load modules & parameters as requested (by key)

                // import(`/src/art/${projectKey}/${projectKey}.ts`).then((module: unknown) => {
                //     console.log(module);
                // });

                // const test = import.meta.glob(`/src/art/${projectKey}/index.ts`, {
                //     eager: true
                // }).default;

                // console.log(test);
                // this.projectList[projectKey] = {
                //     config: config,
                //     classImport: import.meta.glob(`/src/art/${projectKey}/${projectKey}.ts`, { eager: true }).default,
                // }
            });
        }

        // Load typescript imports
        const projects = import.meta.glob('/src/art/*/*.ts');
        console.log(projects);
        for (const path in projects) {
            // Project files are named the same as their containing folder
            const pathComponents = path.split('/');
            const name = pathComponents.pop()?.split('.')[0];
            if (name && pathComponents.indexOf(name) < 0) continue;
        }
    }

    public async loadProject(key: string): Promise<Project> {
        const canvas = document.createElement('canvas');
        const project = new Project(canvas);
        return project;

        /*
        // Get the base Project properties to exclude (todo - do this once only)
        const templateProject = new Project();
        const baseProperties = Object.getOwnPropertyNames(templateProject);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects[path]().then((module: any) => {
            const instance = new module.default();
            const paramKeys = Object.getOwnPropertyNames(instance).filter(
                (key) => baseProperties.indexOf(key) < 0
            );
            console.log(paramKeys);
        });
        */
    }
}

export const Loader = new SketchbookLoader();
