export enum ParamType {
    Number = 'number',
    Boolean = 'boolean'
}

export interface ParamConfig {
    type: ParamType;
    name: string;
    section?: string;
}

/* Number param config */

export interface NumberParamConfig extends ParamConfig {
    min: number;
    max: number;
    step: number;
    liveUpdates: boolean;
    style: 'slider' | 'input';
    options?: string[];
}

export const NumberParamConfigDefaults: NumberParamConfig = {
    type: ParamType.Number,
    name: 'Untitled Number',
    section: undefined,

    min: 0,
    max: 1,
    step: 0.01,
    liveUpdates: true,
    style: 'slider',
    options: undefined
} as const;

/* Boolean param config */

export interface BooleanParamConfig extends ParamConfig {
    enables?: string[];
    disables?: string[]; // todo - implement?
}

export const BooleanParamConfigDefaults: BooleanParamConfig = {
    type: ParamType.Boolean,
    name: 'Untitled Boolean',
    section: undefined,

    enables: undefined,
    disables: undefined
} as const;

// todo: other param types

/* Factory */

export class ParamConfigFactory {
    /**
     * Create a config object from a value and an optional config data object (via JSON).
     * @param value - the value to create a config for
     * @param data - optional config data to reference
     * @returns a config object
     * @throws if the value type is unsupported
     * @throws if the config data contains unsupported fields
     */
    public static configFrom(value: unknown, data?: Record<string, unknown>): ParamConfig {
        // Create the proper type for the value and assign defaults
        let param: ParamConfig;
        if (typeof value === 'number') {
            param = {} as NumberParamConfig;
            Object.assign(param, NumberParamConfigDefaults);
        } else if (typeof value === 'boolean') {
            param = {} as BooleanParamConfig;
            Object.assign(param, BooleanParamConfigDefaults);
        } else {
            throw new Error('Unsupported param type');
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
        }

        // Return the generated param
        return param;
    }
}