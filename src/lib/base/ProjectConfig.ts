import Project from './Project';
import type { ParamConfig } from './ParamConfig';

export class ProjectProjectConfig {
    title = 'Untitled';
    date: Date | undefined;
    description: string | undefined;
    defaultPresetName: string | undefined;
    liveUpdates = true;
    groups: string[] = [];
    experimental = false;
}

export default class ProjectConfig {
    project = new ProjectProjectConfig();
    params: ParamConfig[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #rawData: any;

    /**
     * Create a new ProjectConfig object.
     * @param title - optional title for the project
     */
    constructor(title?: string) {
        if (title) this.project.title = title;
    }

    /**
     * Deserialize a project config object from a JSON object.
     * @param data - object derived from imported JSON data, matching the ProjectConfig interface
     * @returns a ProjectConfig object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public loadProjectConfig(data: any) {
        this.#rawData = data;
        if (data.project) {
            const dataProject = data.project;
            if (dataProject.title) this.project.title = dataProject.title;
            if (dataProject.date) this.project.date = new Date(dataProject.date);
            if (dataProject.description) this.project.description = dataProject.description;
            if (dataProject.defaultPresetName)
                this.project.defaultPresetName = dataProject.defaultPresetName;
            if (dataProject.liveUpdates !== undefined)
                this.project.liveUpdates = dataProject.liveUpdates;
            if (dataProject.groups) this.project.groups = dataProject.groups;
            if (dataProject.experimental !== undefined)
                this.project.experimental = dataProject.experimental;
        }
    }

    /**
     * Load in the params (and param sections) from a Project object, also
     * referencing the already loaded raw config data, if available.
     * @param object - the Project object to load params from
     */
    public loadParamsConfig(object: Project) {
        // Get the list of params from the Project object
        const templateProject = new Project();
        const baseProperties = Object.getOwnPropertyNames(templateProject);
        const paramKeys = Object.getOwnPropertyNames(object).filter(
            (key) => baseProperties.indexOf(key) < 0
        );

        // Create ParamConfig objects for each param, using config data if available
        for (const key of paramKeys) {
            // Get config data if available
            // todo: use this.#rawData.params[key]

            const propertyDescriptor = Object.getOwnPropertyDescriptor(object, key);
            if (!propertyDescriptor || !propertyDescriptor.value)
                throw new Error('Property descriptor not found');
            if (typeof propertyDescriptor.value === 'number') {
                console.log(key, 'is a number');
            } else if (typeof propertyDescriptor.value === 'boolean') {
                console.log(key, 'is a boolean');
            } else if (typeof propertyDescriptor.value === 'string') {
                console.log(key, 'is a string');
            } else if (typeof propertyDescriptor.value === 'object') {
                // todo: function, array, file, etc...
                console.log(key, 'is an object');
            }
        }
    }
}
