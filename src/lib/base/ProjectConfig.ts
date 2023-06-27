import type Project from './Project';

class ParamConfig {
    name = 'Untitled';
}

class NumberParamConfig extends ParamConfig {
    min = 0;
    max = 1;
    step = 0.01;
    liveUpdates = true;
    style = 'slider'; // todo: enum
    options: string[] = [];
}

class BooleanParamConfig extends ParamConfig {
    enables: string[] = [];
}

// todo: other param types

export class ProjectProjectConfig {
    title = 'Untitled';
    date: Date | undefined;
    description: string | undefined;
    defaultPresetName: string | undefined;
    liveUpdates = true;
    groups: string[] = [];
    experimental = false;
}

export class ProjectParamsConfig {
    [key: string]: ParamConfig;
}

export class ProjectParamSectionsConfig {
    [key: string]: {
        name: string;
        params: string[];
    };
}

export default class ProjectConfig {
    project = new ProjectProjectConfig();
    params = new ProjectParamsConfig();
    paramSections = new ProjectParamSectionsConfig();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #rawData: any;

    /**
     * Deserialize a project config object from a JSON object.
     * @param data - object derived from imported JSON data, matching the ProjectConfig interface
     * @returns a ProjectConfig object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static from(data: any): ProjectConfig {
        const config = new ProjectConfig();
        config.#rawData = data;
        if (data.project) {
            const dataProject = data.project;
            if (dataProject.title) config.project.title = dataProject.title;
            if (dataProject.date) config.project.date = new Date(dataProject.date);
            if (dataProject.description) config.project.description = dataProject.description;
            if (dataProject.defaultPresetName)
                config.project.defaultPresetName = dataProject.defaultPresetName;
            if (dataProject.liveUpdates !== undefined)
                config.project.liveUpdates = dataProject.liveUpdates;
            if (dataProject.groups) config.project.groups = dataProject.groups;
            if (dataProject.experimental !== undefined)
                config.project.experimental = dataProject.experimental;
        }
        return config;
    }

    /**
     * Load in the params (and param sections) from a Project object, also
     * referencing the already loaded raw config data, if available.
     * @param object - the Project object to load params from
     */
    public loadParamsFrom(object: Project) {
        if (this.#rawData && this.#rawData.params) {
            const dataParams = this.#rawData.params;
            for (const key in dataParams) {
                const dataParam = dataParams[key];
                // todo
                console.log(dataParam);
            }
        }
        if (this.#rawData && this.#rawData.paramSections) {
            const dataParamSections = this.#rawData.paramSections;
            for (const key in dataParamSections) {
                const dataParamSection = dataParamSections[key];
                // todo
                console.log(dataParamSection);
            }
        }
    }
}
