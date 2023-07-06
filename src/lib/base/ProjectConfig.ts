import Project from './Project';
import { type ParamConfig, ParamConfigFactory } from './ParamConfig';

export interface ProjectProperties {
    title: string;
    date?: Date;
    description?: string;
    defaultPresetName?: string;
    liveUpdates?: boolean;
    groups?: string[];
    experimental?: boolean;
}

export const ProjectPropertiesDefaults: ProjectProperties = {
    title: 'Untitled',
    date: undefined,
    description: undefined,
    defaultPresetName: undefined,
    liveUpdates: true,
    groups: [],
    experimental: false
};

export class ProjectConfigFactory {
    /**
     * Deserialize a project properties object from a JSON object, or create one with default values
     * if no data is provided.
     * @param data - object derived from imported JSON data, matching to ProjectProperties
     * @returns a ProjectProperties object
     */
    public static propsFrom(data?: Record<string, unknown>): ProjectProperties {
        // Create new properties config object and assign defaults
        const props = {} as ProjectProperties;
        Object.assign(props, ProjectPropertiesDefaults);
        if (!data) return props;

        // Assign properties from data
        const propKeys: string[] = Object.getOwnPropertyNames(props);
        for (const key of propKeys) {
            if (key === 'date') {
                // Deserialize date as a Date object
                if (data[key]) props[key] = new Date(data[key] as string);
            } else if (data[key] !== undefined) {
                // Copy other properties directly
                Object.defineProperty(props, key, {
                    value: data[key],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
        }
        return props;
    }

    /**
     * Create param config objects from the properties in a Project object, also referencing
     * config data, if provided.
     * @param project - the Project object to load params from
     * @param data - optional config data to reference
     */
    public static paramsFrom(
        project: Project,
        data?: Record<string, Record<string, unknown>>
    ): Record<string, ParamConfig> {
        const params: Record<string, ParamConfig> = {};

        // Get the list of params from the Project object
        const templateProject = new Project();
        const baseProperties = Object.getOwnPropertyNames(templateProject);
        const paramKeys = Object.getOwnPropertyNames(project).filter(
            (key) => baseProperties.indexOf(key) < 0
        );

        // Create ParamConfig objects for each param, using config data if available
        for (const key of paramKeys) {
            // Derive a ParamConfig object
            const propertyDescriptor = Object.getOwnPropertyDescriptor(project, key);
            if (!propertyDescriptor || !propertyDescriptor.value)
                throw new Error('No param value available.');
            const configData = data ? data[key] : undefined;
            const paramConfig = ParamConfigFactory.configFrom(propertyDescriptor.value, configData);
            // Assign ParamConfig object
            params[key] = paramConfig;
        }
        return params;
    }
}
