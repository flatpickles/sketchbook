import Project from './Project';
import ProjectConfig from './ProjectConfig';

export class SketchbookLoader {
    public availableProjects: Record<string, ProjectConfig> = {};
    #projectImports: Record<string, () => Promise<unknown>> = {};

    public constructor() {
        this.#loadProjectData();
    }

    #loadProjectData(): void {
        // Collect projects from config files
        const configFiles = import.meta.glob('/src/art/*/config.json');
        for (const path in configFiles) {
            // Find the project key from the path
            const pathComponents = path.split('/');
            const projectKey = pathComponents.pop()?.split('.')[0];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');

            // Deserialize the config file into a ProjectConfig object
            configFiles[path]().then((module: unknown) => {
                const configObject = ProjectConfig.from(module);
                this.availableProjects[projectKey] = configObject;

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

        // Collect projects from class files
        const projectFiles = import.meta.glob('/src/art/*/*.ts');
        for (const path in projectFiles) {
            // Find the project key from the path
            const pathComponents = path.split('/');
            const projectKey = pathComponents.pop()?.split('.')[0];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');

            // Project files are named the same as their containing folder
            if (projectKey && pathComponents.indexOf(projectKey) < 0) continue;

            // If we don't already have a config for this project, create one
            if (!this.availableProjects[projectKey]) {
                const freshConfig = new ProjectConfig();
                freshConfig.project.title = projectKey;
                this.availableProjects[projectKey] = freshConfig;
            }

            // Store the import function for later use
            this.#projectImports[projectKey] = projectFiles[path];
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
