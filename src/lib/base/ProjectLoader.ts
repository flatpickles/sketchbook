import { importProjectClassFiles, importProjectConfigFiles } from './BundledFileProviders';
import Project from './Project';
import ProjectConfig from './ProjectConfig';

export default class ProjectLoader {
    public async loadAvailableProjects(): Promise<Record<string, ProjectConfig>> {
        const availableProjects: Record<string, ProjectConfig> = {};

        // Collect projects from class files
        const projectFiles = importProjectClassFiles();
        for (const path in projectFiles) {
            // Find the project key from the file name
            const pathComponents = path.split('/');
            const projectKey = pathComponents.pop()?.split('.')[0];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');

            // Project files are named the same as their containing folder; skip other files
            if (projectKey && pathComponents.indexOf(projectKey) < 0) continue;

            // Create a new config for this project
            if (availableProjects[projectKey]) throw new Error('Loader: Duplicate project key.');
            availableProjects[projectKey] = new ProjectConfig(projectKey);
        }

        // Collect projects from config files
        const configFiles = importProjectConfigFiles();
        for (const path in configFiles) {
            // Find the project key from the directory name
            const pathComponents = path.split('/');
            const projectKey = pathComponents[pathComponents.length - 2];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');

            // Ignore config files without an associated project class file
            if (!availableProjects[projectKey]) continue;

            // Deserialize the config file into a ProjectConfig object
            const module = await configFiles[path]();
            availableProjects[projectKey].loadProjectConfig(module);
        }
        return availableProjects;
    }

    public async loadProject(key: string): Promise<Project> {
        const canvas = document.createElement('canvas');
        const project = new Project(canvas);
        return project;

        // TODO: Implement this

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
