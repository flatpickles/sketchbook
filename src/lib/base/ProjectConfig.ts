import Project from './Project';
import { ParamConfig } from './ParamConfig';

/*
    todo:
    - tests
    - maybe use a "from" method like ParamConfig... why have these objects before loading a config?
*/

export class ProjectProperties {
    title = 'Untitled';
    date: Date | undefined;
    description: string | undefined;
    defaultPresetName: string | undefined;
    liveUpdates = true;
    groups: string[] = [];
    experimental = false;
}

export default class ProjectConfig {
    props = new ProjectProperties();
    params: Record<string, ParamConfig> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #rawData: any;

    /**
     * Create a new ProjectConfig object.
     * @param title - optional title for the project
     */
    constructor(title?: string) {
        if (title) this.props.title = title;
    }

    /**
     * Deserialize a project config object from a JSON object.
     * @param data - object derived from imported JSON data, matching the ProjectConfig interface
     * @returns a ProjectConfig object
     */
    public loadProjectConfig(data: Record<string, unknown>) {
        const propKeys: string[] = Object.getOwnPropertyNames(this.props);
        for (const key of propKeys) {
            if (key === 'date') {
                // Deserialize date as a Date object
                if (data[key]) this.props[key] = new Date(data[key] as string);
            } else if (key === 'params') {
                // Ignore params here, they must be loaded with a Project object
                continue;
            } else if (data[key] !== undefined) {
                // Copy other properties directly
                Object.defineProperty(this.props, key, {
                    value: data[key],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
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
            // Derive a ParamConfig object
            const propertyDescriptor = Object.getOwnPropertyDescriptor(object, key);
            if (!propertyDescriptor || !propertyDescriptor.value)
                throw new Error('No param value available.');
            const paramConfig = ParamConfig.from(
                propertyDescriptor.value,
                this.#rawData?.params[key]
            );
            // Assign ParamConfig object
            this.params[key] = paramConfig;
        }
    }
}
