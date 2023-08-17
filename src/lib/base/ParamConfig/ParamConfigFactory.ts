import type { ParamConfig } from './ParamConfig';
import { type NumberParamConfig, NumberParamConfigDefaults } from './NumberParamConfig';
import { type BooleanParamConfig, BooleanParamConfigDefaults } from './BooleanParamConfig';
import { FunctionParamConfigDefaults, type FunctionParamConfig } from './FunctionParamConfig';
import { StringParamConfigDefaults, type StringParamConfig } from './StringParamConfig';
import {
    NumericArrayParamConfigDefaults,
    type NumericArrayParamConfig
} from './NumericArrayParamConfig';
import { ProjectConfigDefaults } from '../ProjectConfig/ProjectConfig';
import {
    FileParamConfigDefaults,
    type FileParamConfig,
    isFileParamConfig,
    FileReaderMode
} from './FileParamConfig';

export class ParamConfigFactory {
    /**
     * Create a config object from a value and an optional config data object (via JSON).
     * @param value - the value to create a config for
     * @param key - the key for this parameter value
     * @param data - optional config data to reference
     * @param liveUpdatesDefault - the default value for liveUpdates
     * @returns a config object
     * @throws if the value type is unsupported
     * @throws if the config data contains unsupported fields
     */
    public static configFrom(
        value: unknown,
        key: string,
        data?: Record<string, unknown>,
        liveUpdatesDefault = ProjectConfigDefaults.liveUpdates
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
            const fnLengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
            const fnLength = fnLengthDescriptor ? fnLengthDescriptor.value : 0;
            if (fnLength == 0) {
                // If the function has no parameters, it's a function param
                param = {} as FunctionParamConfig;
                Object.assign(param, FunctionParamConfigDefaults);
            } else {
                // Otherwise, it's a file param
                param = {} as FileParamConfig;
                Object.assign(param, FileParamConfigDefaults);
            }
        } else if (typeof value === 'string') {
            param = {} as StringParamConfig;
            Object.assign(param, StringParamConfigDefaults);
        } else if (Array.isArray(value)) {
            // Validate array param
            let numericEntries = true;
            for (const entry of value) {
                if (typeof entry != 'number') {
                    numericEntries = false;
                    break;
                }
            }
            if (!numericEntries) {
                throw new Error(`Non-numeric array params are unsupported (${key})`);
            } else if (value.length < 1) {
                throw new Error(`Empty array params are unsupported (${key})`);
            }
            // Proceed!
            param = {} as NumericArrayParamConfig;
            Object.assign(param, NumericArrayParamConfigDefaults);
        } else {
            throw new Error(`${typeof value} params are unsupported (${key})`);
        }

        // Assign sketchbook liveUpdates value to this param
        param.liveUpdates = liveUpdatesDefault;

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

        // Validate file param config accept value
        if (isFileParamConfig(param)) {
            if (param.mode === FileReaderMode.Image) {
                if (param.accept === FileParamConfigDefaults.accept) {
                    // Set accept to image/* if accept is default (i.e. undefined)
                    param.accept = 'image/*';
                } else if (!param.accept.includes('image')) {
                    // Throw if accept has been set to an invalid value for image loading
                    throw new Error(
                        `File param with "image" mode must include "image" in its accept value (${key})`
                    );
                }
            }
        }

        // Return the generated param
        param.key = key;
        return param;
    }
}
