import type { ParamConfig } from '../ParamConfig/ParamConfig';
import { ParamConfigFactory } from '../ParamConfig/ParamConfigFactory';
import type Project from '../Project/Project';
import { type ProjectConfig, ProjectConfigDefaults } from './ProjectConfig';

// Keys that should be ignored when creating a ProjectConfig object from a Project object
const paramKeysToIgnore = ['canvas', 'container', 'canvasType', 'p5'];

export class ProjectConfigFactory {
    /**
     * Deserialize a project properties object from a JSON object, or create one with default values
     * if no data is provided.
     * @param data - object derived from imported JSON data, matching to ProjectProperties
     * @returns a ProjectProperties object
     */
    public static propsFrom(data?: Record<string, unknown>): ProjectConfig {
        // Create new properties config object and assign defaults
        const props = {} as ProjectConfig;
        Object.assign(props, ProjectConfigDefaults);
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
     * @param applyDuringInputDefault - the default value for applyDuringInput
     * @param data - optional config data to reference
     */
    public static paramsFrom(
        project: Project,
        data?: Record<string, Record<string, unknown>>,
        applyDuringInputDefault = ProjectConfigDefaults.paramsApplyDuringInput
    ): ParamConfig[] {
        const params: ParamConfig[] = [];

        // Get the list of params from the Project object
        const paramKeys = Object.getOwnPropertyNames(project).filter(
            (key) => paramKeysToIgnore.indexOf(key) < 0
        );

        // Create ParamConfig objects for each param, using config data if available
        for (const key of paramKeys) {
            // Derive a ParamConfig object
            const propertyDescriptor = Object.getOwnPropertyDescriptor(project, key);
            if (!propertyDescriptor || propertyDescriptor.value == undefined)
                throw new Error('No param value available: ' + key);
            const configData = data ? data[key] : undefined;
            const paramConfig = ParamConfigFactory.configFrom(
                propertyDescriptor.value,
                key,
                configData,
                applyDuringInputDefault
            );
            // Assign ParamConfig object
            params.push(paramConfig);
        }
        return params;
    }
}
