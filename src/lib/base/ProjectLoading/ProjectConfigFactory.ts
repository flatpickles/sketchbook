import type { ParamConfig } from '../ConfigModels/ParamConfig';
import { ParamConfigFactory } from './ParamConfigFactory';
import type Project from '../Project/Project';
import { type ProjectConfig, ProjectConfigDefaults } from '../ConfigModels/ProjectConfig';
import ParamInference, { InferenceMode } from './ParamInference';

// Property keys that should be ignored when creating a ProjectConfig object from a Project object,
// in addition to any custom ignoreKeys set by the Project.
const ignoreKeysBase = ['canvas', 'container', 'canvasType', 'ignoreKeys'];

export class ProjectConfigFactory {
    /**
     * Deserialize a project properties object from a JSON object, or create one with default values
     * if no data is provided.
     * @param data - object derived from imported JSON data, matching to ProjectProperties
     * @returns a ProjectProperties object
     */
    public static projectConfigFrom(data?: Record<string, unknown>): ProjectConfig {
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
     * @param rawFileText - the raw text of the ts/js or shader file
     * @param inferenceMode - the mode to use for inferring param configs from comments
     * @param applyDuringInputDefault - the default value for applyDuringInput
     * @param data - optional config data to reference
     */
    public static paramConfigsFrom(
        project: Project,
        rawFileText: string,
        inferenceMode: InferenceMode,
        data?: Record<string, Record<string, unknown>>,
        applyDuringInputDefault = ProjectConfigDefaults.paramsApplyDuringInput
    ): ParamConfig[] {
        const params: ParamConfig[] = [];

        // Get the list of params from the Project object
        const ignoreKeys = ignoreKeysBase.concat(project.ignoreKeys);
        const paramKeys = Object.getOwnPropertyNames(project).filter(
            (key) => ignoreKeys.indexOf(key) < 0
        );

        // Get commented annotations from the raw file text
        const annotations = ParamInference.paramAnnotations(paramKeys, inferenceMode, rawFileText);

        // Create ParamConfig objects for each param, using config data and comments if available
        for (const key of paramKeys) {
            // Derive a ParamConfig object
            const propertyDescriptor = Object.getOwnPropertyDescriptor(project, key);
            if (!propertyDescriptor || propertyDescriptor.value == undefined)
                throw new Error('No param value available: ' + key);
            const configData = data ? data[key] : undefined;
            const annotation = annotations[key];
            const paramConfig = ParamConfigFactory.paramConfigFrom(
                propertyDescriptor.value,
                key,
                inferenceMode,
                annotation,
                configData,
                applyDuringInputDefault
            );
            // Assign ParamConfig object
            params.push(paramConfig);
        }
        return params;
    }
}
