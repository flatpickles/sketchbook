import { importProjectClassFiles, importProjectConfigFiles } from './FileProviders';
import type Project from './Project';
import ProjectConfig from './ProjectConfig';

interface ProjectTuple {
    project: Project;
    config: ProjectConfig;
}

export default class ProjectLoader {
    #projectClassFiles: Record<string, () => Promise<unknown>> | undefined;
    #projectConfigFiles: Record<string, () => Promise<unknown>> | undefined;

    /**
     * Load a collection of available projects. The returned ProjectConfig objects will
     * not be fully hydrated with project parameters, as the project class file must be
     * loaded to determine these.
     * @returns A map of project keys to ProjectConfig objects.
     */
    public async loadAvailableProjects(): Promise<Record<string, ProjectConfig>> {
        const availableProjects: Record<string, ProjectConfig> = {};

        // Collect projects from class files
        this.#projectClassFiles = this.#projectClassFiles ?? importProjectClassFiles();
        for (const path in this.#projectClassFiles) {
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
        this.#projectConfigFiles = this.#projectConfigFiles ?? importProjectConfigFiles();
        for (const path in this.#projectConfigFiles) {
            // Find the project key from the directory name
            const pathComponents = path.split('/');
            const projectKey = pathComponents[pathComponents.length - 2];
            if (!projectKey) throw new Error('Loader: Failure to parse project key from path.');

            // Ignore config files without an associated project class file
            if (!availableProjects[projectKey]) continue;

            // Deserialize the config file into a ProjectConfig object
            const module = await this.#projectConfigFiles[path]();
            availableProjects[projectKey].loadProjectConfig(module);
        }
        return availableProjects;
    }

    /**
     * Fully load the project corresponding to a particular project key.
     * @param key - the project key.
     * @returns A tuple containing the Project object and a fully hydrated ProjectConfig object.
     */
    public async loadProject(
        key: string,
        displayCanvas?: HTMLCanvasElement
    ): Promise<ProjectTuple | null> {
        // Load bundled files if not already loaded
        this.#projectClassFiles = this.#projectClassFiles ?? importProjectClassFiles();
        this.#projectConfigFiles = this.#projectConfigFiles ?? importProjectConfigFiles();

        // Instantiate the proper project class
        const classFilePath = Object.keys(this.#projectClassFiles).filter((path) => {
            const pathComponents = path.split('/');
            const projectKey = pathComponents.pop()?.split('.')[0];
            return projectKey === key;
        })[0];
        if (!classFilePath) return null;
        const classModule = (await this.#projectClassFiles[classFilePath]()) as {
            // Matching the Project constructor...
            default: new (canvas: HTMLCanvasElement | undefined) => Project;
        };
        const project = new classModule.default(displayCanvas);

        // Create config with config file (if any)
        const configFilePath = Object.keys(this.#projectConfigFiles).filter((path) => {
            const pathComponents = path.split('/');
            const projectKey = pathComponents[pathComponents.length - 2];
            return projectKey === key;
        })[0];
        const config = new ProjectConfig(key);
        if (configFilePath) {
            const configModule = await this.#projectConfigFiles[configFilePath]();
            config.loadProjectConfig(configModule);
        }

        // Update config with params in project
        config.loadParamsConfig(project);

        // Return tuple
        return {
            project,
            config
        };
    }
}
