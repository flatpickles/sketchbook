import type { ParamConfig } from './ParamConfig';
import { type NumberParamConfig, NumberParamConfigDefaults } from './NumberParamConfig';
import { type BooleanParamConfig, BooleanParamConfigDefaults } from './BooleanParamConfig';
import { FunctionParamConfigDefaults, type FunctionParamConfig } from './FunctionParamConfig';

export class ParamConfigFactory {
    /**
     * Create a config object from a value and an optional config data object (via JSON).
     * @param value - the value to create a config for
     * @param fallbackName - the name to use if no config data is provided
     * @param data - optional config data to reference
     * @returns a config object
     * @throws if the value type is unsupported
     * @throws if the config data contains unsupported fields
     */
    public static configFrom(
        value: unknown,
        key: string,
        data?: Record<string, unknown>
    ): ParamConfig {
        // Create the proper type for the value and assign defaults
        let param: ParamConfig;
        if (typeof value === 'number') {
            param = {} as NumberParamConfig;
            Object.assign(param, NumberParamConfigDefaults);
        } else if (typeof value === 'boolean') {
            param = {} as BooleanParamConfig;
            Object.assign(param, BooleanParamConfigDefaults);
        } else if (typeof value === 'function') {
            param = {} as FunctionParamConfig;
            Object.assign(param, FunctionParamConfigDefaults);
        } else {
            throw new Error('Unsupported param type: ' + typeof value);
        }

        // If the config exists, assign its properties to the param
        if (data) {
            // Check all config fields to make sure they're supported
            const configKeys = Object.getOwnPropertyNames(data);
            for (const key of configKeys) {
                if (Object.getOwnPropertyNames(param).indexOf(key) < 0) {
                    throw new Error(`Unsupported param config field: ${key}`);
                }
            }
            // Assign the config fields to the param
            Object.assign(param, data);
        } else {
            // If no config exists, assign the value as the default
            param.name = key;
        }

        // Return the generated param
        param.key = key;
        return param;
    }
}
