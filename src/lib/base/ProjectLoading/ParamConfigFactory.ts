import { ParamConfigDefaults, type ParamConfig } from '../ConfigModels/ParamConfig';
import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '../ConfigModels/ParamConfigs/NumberParamConfig';
import {
    type BooleanParamConfig,
    BooleanParamConfigDefaults
} from '../ConfigModels/ParamConfigs/BooleanParamConfig';
import {
    FunctionParamConfigDefaults,
    type FunctionParamConfig
} from '../ConfigModels/ParamConfigs/FunctionParamConfig';
import {
    StringParamConfigDefaults,
    type StringParamConfig
} from '../ConfigModels/ParamConfigs/StringParamConfig';
import {
    NumericArrayParamConfigDefaults,
    type NumericArrayParamConfig,
    isNumericArrayParamConfig,
    isNumericArray,
    NumericArrayParamStyle
} from '../ConfigModels/ParamConfigs/NumericArrayParamConfig';
import { ProjectConfigDefaults } from '../ConfigModels/ProjectConfig';
import {
    FileParamConfigDefaults,
    type FileParamConfig,
    isFileParamConfig,
    FileReaderMode
} from '../ConfigModels/ParamConfigs/FileParamConfig';
import ParamInference, { InferenceMode } from './ParamInference';

export class ParamConfigFactory {
    /**
     * Create a config object from a value and an optional config data object (via JSON).
     * @param value - the value to create a config for
     * @param key - the key for this parameter value
     * @param annotation - optional commented annotation for this parameter value
     * @param data - optional config data to reference
     * @param applyDuringInputDefault - the default value for applyDuringInput
     * @returns a config object
     * @throws if the value type is unsupported
     * @throws if the config data contains unsupported fields
     */
    public static paramConfigFrom(
        value: unknown,
        key: string,
        inferenceMode: InferenceMode,
        annotation?: string,
        data?: Record<string, unknown>,
        applyDuringInputDefault = ProjectConfigDefaults.paramsApplyDuringInput
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

        // Assign the param key
        param.key = key;

        // Apply any intentions inferred within the annotation string (comment)
        if (annotation) {
            param = ParamInference.paramWithInference(param, inferenceMode, annotation);
        }

        // If the name is still the default, assign the key as the name
        if (param.name === ParamConfigDefaults.name) param.name = key;

        // Assign applyDuringInputDefault value to this param, derived from the project config's
        // paramsApplyDuringInput value, and potentially overridden per-param in the assign below
        param.applyDuringInput = applyDuringInputDefault;

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

        // Validate array param config style
        if (isNumericArrayParamConfig(param) && isNumericArray(value)) {
            if (
                param.style === NumericArrayParamStyle.ByteColor ||
                param.style === NumericArrayParamStyle.UnitColor
            ) {
                // Validate number of components
                if (value.length != 3)
                    throw new Error(
                        `Array param with a "color" style must have 3 elements (${key})`
                    );
                // Validate color component values (min/max/integer)
                const style = param.style; // type is no longer narrowed in the forEach below
                const colorCompUpperBound = style === NumericArrayParamStyle.UnitColor ? 1 : 255;
                value.forEach((colorComponent) => {
                    if (colorComponent < 0 || colorComponent > colorCompUpperBound)
                        throw new Error(
                            `Array param with a "${style}" style must have values between 0 and ${colorCompUpperBound} (${key})`
                        );
                    if (style === NumericArrayParamStyle.ByteColor) {
                        if (!Number.isInteger(colorComponent))
                            throw new Error(
                                `Array param with "byteColor" style must have integer values; use "unitColor" for 0-1 values (${key})`
                            );
                    }
                });
            }
        }

        // Return the generated param
        return param;
    }
}
