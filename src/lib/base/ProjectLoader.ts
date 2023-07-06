import { importProjectClassFiles, importProjectConfigFiles } from './FileProviders';
import type Project from './Project';
import {
    type ProjectProperties,
    ProjectConfigFactory,
    ProjectPropertiesDefaults
} from './ProjectConfig';
import type { ParamConfig } from './ParamConfig';

export interface ProjectTuple {
    project: Project;
    props: ProjectProperties;
    params: Record<string, ParamConfig>;
}

type ProjectModule = {
    // Matching the Project constructor...
    default: new (canvas: HTMLCanvasElement | undefined) => Project;
};

export default class ProjectLoader {
    /**
     * Load a collection of available projects as a map of project keys to ProjectConfig objects.
     * @returns A map of project keys to ProjectProperties objects.
     */
    public static async loadAvailableProjects(): Promise<Record<string, ProjectProperties>> {
        // Load files
        const projectClassFiles = importProjectClassFiles();
        const projectConfigFiles = importProjectConfigFiles();

        // Collect configuration data from config files, where available
        const projectConfigurations: Record<string, Record<string, unknown>> = {};
        for (const path in projectConfigFiles) {
            // Find the project key from the directory name
            const projectKey = ProjectLoader.#keyFromConfigPath(path);

            // Deserialize the config file into a ProjectConfig object
            const module = await projectConfigFiles[path]();
            projectConfigurations[projectKey] = module as Record<string, unknown>;
        }

        // Collect projects from class files and assign config data if any
        const availableProjects: Record<string, ProjectProperties> = {};
        for (const path in projectClassFiles) {
            // Find the project key from the file name
            const projectKey = ProjectLoader.#keyFromProjectPath(path);

            // Project files are named the same as their containing folder; skip other files
            const pathComponents = path.split('/');
            if (projectKey && pathComponents.indexOf(projectKey) < 0) continue;

            // Create a new config for this project if it doesn't already exist
            availableProjects[projectKey] = ProjectConfigFactory.propsFrom(
                projectConfigurations[projectKey]
            );

            // Assign the project title if unset
            if (availableProjects[projectKey].title === ProjectPropertiesDefaults.title) {
                availableProjects[projectKey].title = projectKey;
            }
        }

        return availableProjects;
    }

    /**
     * Fully load the project corresponding to a particular project key.
     * @param key - the project key.
     * @returns a ProjectTuple object containing the project, its properties, and its params.
     */
    public static async loadProject(
        key: string,
        displayCanvas?: HTMLCanvasElement
    ): Promise<ProjectTuple | null> {
        // Load files
        const projectClassFiles = importProjectClassFiles();
        const projectConfigFiles = importProjectConfigFiles();

        // Instantiate the proper project class
        const classFilePath = Object.keys(projectClassFiles).filter((path) => {
            return ProjectLoader.#keyFromProjectPath(path) === key;
        })[0];
        if (!classFilePath) return null;
        const classModule = (await projectClassFiles[classFilePath]()) as ProjectModule;
        const project = new classModule.default(displayCanvas);

        // Create props & params with project and config file (if any)
        const configFilePath = Object.keys(projectConfigFiles).filter((path) => {
            return ProjectLoader.#keyFromConfigPath(path) === key;
        })[0];
        const configModule = (
            configFilePath ? await projectConfigFiles[configFilePath]() : undefined
        ) as Record<string, unknown> | undefined;
        const props = ProjectConfigFactory.propsFrom(
            configModule as Record<string, unknown> | undefined
        );
        const params = ProjectConfigFactory.paramsFrom(
            project,
            configModule?.params as Record<string, Record<string, unknown>> | undefined
        );

        // Assign the project title if unset
        if (props.title === ProjectPropertiesDefaults.title) {
            props.title = key;
        }

        // Return tuple
        return {
            project,
            props,
            params
        };
    }

    static #keyFromProjectPath(path: string): string {
        const pathComponents = path.split('/');
        const projectKey = pathComponents.pop()?.split('.')[0];
        if (!projectKey) throw new Error('Loader: Failure to parse project key from project path.');
        return projectKey;
    }

    static #keyFromConfigPath(path: string): string {
        const pathComponents = path.split('/');
        const projectKey = pathComponents[pathComponents.length - 2];
        if (!projectKey) throw new Error('Loader: Failure to parse project key from config path.');
        return projectKey;
    }
}
