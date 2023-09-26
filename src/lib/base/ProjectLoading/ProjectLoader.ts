import {
    importProjectClassFiles,
    importProjectFilesRaw,
    importProjectConfigFiles,
    importProjectTextFiles
} from './ImportProviders';
import Project from '../Project/Project';
import { type ProjectConfig, ProjectConfigDefaults } from '../ConfigModels/ProjectConfig';
import type { ParamConfig } from '../ConfigModels/ParamConfig';
import { ProjectConfigFactory } from './ProjectConfigFactory';
import ParamValueProvider from './ParamValueProvider';
import { browser } from '$app/environment';
import FragShaderProject from '../Project/FragShaderProject';

export interface ProjectTuple {
    key: string;
    project: Project;
    config: ProjectConfig;
    params: ParamConfig[];
}

// Type to match the Project constructor
type ProjectModule = {
    default: new () => Project;
};

// Types for all project file imports
type ImportResult = Record<string, () => Promise<unknown>>;
type AllImports = {
    projectClassFiles: ImportResult;
    projectFilesRaw: ImportResult;
    projectTextFiles: ImportResult;
    projectConfigFiles: ImportResult;
};

export default class ProjectLoader {
    /**
     * Load a collection of available projects as a map of project keys to ProjectConfig objects.
     * @returns A map of project keys to ProjectProperties objects.
     */
    public static async loadAvailableProjects(): Promise<Record<string, ProjectConfig>> {
        // Vite glob imports for project files
        const allImports: AllImports = {
            projectClassFiles: importProjectClassFiles(),
            projectFilesRaw: importProjectFilesRaw(),
            projectTextFiles: importProjectTextFiles(),
            projectConfigFiles: importProjectConfigFiles()
        };

        // Collect configuration data from config files, where available
        const projectConfigurations: Record<string, Record<string, unknown>> = {};
        for (const path in allImports.projectConfigFiles) {
            // Find the project key from the directory name
            const projectKey = ProjectLoader.#keyFromConfigPath(path);

            // Deserialize the config file into a ProjectConfig object
            const module = await allImports.projectConfigFiles[path]();
            projectConfigurations[projectKey] = module as Record<string, unknown>;
        }

        // Collect projects from class files and assign config data if any
        const availableProjects: Record<string, ProjectConfig> = {};
        const projectPaths = Object.keys(allImports.projectClassFiles).concat(
            Object.keys(allImports.projectTextFiles)
        );
        for (const path of projectPaths) {
            // Find the project key from the file name
            const projectKey = ProjectLoader.#keyFromProjectPath(path);

            // Project files are named the same as their containing folder; skip other files
            const pathComponents = path.split('/');
            if (projectKey && pathComponents.indexOf(projectKey) < 0) continue;

            // Check to make sure we can load this project
            const projectValid = await ProjectLoader.#validateProject(allImports, path);
            if (!projectValid) continue;

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
     * Fully load the project (Project subclass instance) corresponding to a particular project key.
     * @param key - the project key.
     * @returns a ProjectTuple object containing the project, its properties, and its params.
     */
    public static async loadProject(key: string): Promise<ProjectTuple | null> {
        // Vite glob imports for project files
        const allImports: AllImports = {
            projectClassFiles: importProjectClassFiles(),
            projectFilesRaw: importProjectFilesRaw(),
            projectTextFiles: importProjectTextFiles(),
            projectConfigFiles: importProjectConfigFiles()
        };

        // Load files and find the project file path
        const projectConfigFiles = importProjectConfigFiles();
        const classFilePath = Object.keys(allImports.projectClassFiles).filter((path) => {
            return ProjectLoader.#keyFromProjectPath(path) === key;
        })[0];
        const textFilePath = Object.keys(allImports.projectTextFiles).filter((path) => {
            return ProjectLoader.#keyFromProjectPath(path) === key;
        })[0];

        // Instantiate the proper project
        if (!classFilePath && !textFilePath) return null;
        const project = await ProjectLoader.#loadProject(allImports, classFilePath || textFilePath);

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
            props.paramsApplyDuringInput
        );

        // Assign the project title if unset
        if (props.title === ProjectConfigDefaults.title) {
            props.title = key;
        }

        // Set project properties to stored values
        if (browser) {
            for (const param of params) {
                const storedValue = ParamValueProvider.getValue(param, key, project, true);
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
            key,
            project,
            config: props,
            params
        };
    }

    /**
     * Validate a potential project import via its text representation, so we can do this in SSR
     * without actually importing the project class files or its dependencies, e.g. P5, which can't
     * be imported in a node context.
     */
    static async #validateProject(fromImports: AllImports, filePath: string): Promise<boolean> {
        const projectTextModule = fromImports.projectFilesRaw[filePath];
        const projectText: string = (await projectTextModule()) as string;
        // These checks are an extreme MVP; we could do more sophisticated validation here.
        // Proper validation is done in #loadProject, so at the very least we'll catch errors there.
        if (filePath.includes('.ts') || filePath.includes('.js')) {
            return projectText.includes('export default class') && projectText.includes('extends');
        } else if (filePath.includes('.frag')) {
            return projectText.includes('void main()');
        }
        return true;
    }

    static async #loadProject(fromImports: AllImports, filePath: string): Promise<Project> {
        if (filePath.includes('.ts') || filePath.includes('.js')) {
            const module = (await fromImports.projectClassFiles[filePath]()) as ProjectModule;
            if (!module.default) {
                // The project file must export a default class
                throw new Error(`No default export for ${filePath}`);
            }
            const project = new module.default();
            if (!(project instanceof Project)) {
                // The project must be a subclass of Project
                throw new Error(
                    `Project class file at path ${filePath} is not a subclass of Project`
                );
            }
            return project;
        } else if (filePath.includes('.frag')) {
            const fragShader: string = (await fromImports.projectTextFiles[filePath]()) as string;
            return new FragShaderProject(fragShader);
        } else {
            throw new Error(`Unsupported project class file type for path: ${filePath}`);
        }
    }

    static #keyFromProjectPath(path: string): string {
        const pathComponents = path.split('/');
        const projectKey = pathComponents.pop()?.split('.')[0];
        if (!projectKey) throw new Error(`Failure to parse project key from project path: ${path}`);
        return projectKey;
    }

    static #keyFromConfigPath(path: string): string {
        const pathComponents = path.split('/');
        const projectKey = pathComponents[pathComponents.length - 2];
        if (!projectKey) throw new Error(`Failure to parse project key from config path: ${path}`);
        return projectKey;
    }
}
