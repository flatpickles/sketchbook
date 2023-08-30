import {
    importProjectClassFiles,
    importProjectConfigFiles,
    importProjectTextFiles
} from './FileProviders';
import type Project from '../Project/Project';
import { type ProjectConfig, ProjectConfigDefaults } from '../ProjectConfig/ProjectConfig';
import type { ParamConfig } from '../ParamConfig/ParamConfig';
import { ProjectConfigFactory } from '../ProjectConfig/ProjectConfigFactory';
import ParamValueProvider from '../Util/ParamValueProvider';
import { browser } from '$app/environment';
import FragShaderProject from '../Project/FragShaderProject';

export interface ProjectTuple {
    project: Project;
    props: ProjectConfig;
    params: ParamConfig[];
}

type ProjectModule = {
    // Matching the Project constructor...
    default: new () => Project;
};

export default class ProjectLoader {
    /**
     * Load a collection of available projects as a map of project keys to ProjectConfig objects.
     * @returns A map of project keys to ProjectProperties objects.
     */
    public static async loadAvailableProjects(): Promise<Record<string, ProjectConfig>> {
        // Load files
        const projectClassFiles = importProjectClassFiles();
        const projectTextFiles = importProjectTextFiles();
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
        const availableProjects: Record<string, ProjectConfig> = {};
        const projectPaths = Object.keys(projectClassFiles).concat(Object.keys(projectTextFiles));
        for (const path of projectPaths) {
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
            if (availableProjects[projectKey].title === ProjectConfigDefaults.title) {
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
    public static async loadProject(key: string): Promise<ProjectTuple | null> {
        // Load files and find the project file path
        const projectClassFiles = importProjectClassFiles();
        const projectTextFiles = importProjectTextFiles();
        const projectConfigFiles = importProjectConfigFiles();
        const classFilePath = Object.keys(projectClassFiles).filter((path) => {
            return ProjectLoader.#keyFromProjectPath(path) === key;
        })[0];
        const textFilePath = Object.keys(projectTextFiles).filter((path) => {
            return ProjectLoader.#keyFromProjectPath(path) === key;
        })[0];

        // Instantiate the proper project
        let project: Project;
        if (classFilePath) {
            if (!classFilePath.includes('.ts') && !classFilePath.includes('.js')) {
                throw new Error(
                    `Loader: Unsupported project class file type for path: ${classFilePath}`
                );
            }
            const module = (await projectClassFiles[classFilePath]()) as ProjectModule;
            project = new module.default();
        } else if (textFilePath) {
            if (!textFilePath.includes('.frag')) {
                throw new Error(
                    `Loader: Unsupported project text file type for path: ${textFilePath}`
                );
            }
            const fragShader: string = (await projectTextFiles[textFilePath]()) as string;
            project = new FragShaderProject(fragShader);
        } else {
            return null;
        }

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
            configModule?.params as Record<string, Record<string, unknown>> | undefined,
            props.liveUpdates
        );

        // Assign the project title if unset
        if (props.title === ProjectConfigDefaults.title) {
            props.title = key;
        }

        // Set project properties to stored values
        if (browser) {
            for (const param of params) {
                const storedValue = ParamValueProvider.getValue(param, props.title, project);
                if (typeof storedValue === 'function') continue;
                Object.defineProperty(project, param.key, {
                    value: storedValue,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
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
        if (!projectKey)
            throw new Error(`Loader: Failure to parse project key from project path: ${path}`);
        return projectKey;
    }

    static #keyFromConfigPath(path: string): string {
        const pathComponents = path.split('/');
        const projectKey = pathComponents[pathComponents.length - 2];
        if (!projectKey)
            throw new Error(`Loader: Failure to parse project key from config path: ${path}`);
        return projectKey;
    }
}
