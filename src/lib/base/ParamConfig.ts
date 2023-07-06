export class ParamConfig {
    name = 'Untitled';
    section: string | undefined;

    constructor(name?: string) {
        if (name) this.name = name;
    }

    public static from(value: unknown, data?: Record<string, unknown>): ParamConfig {
        // Create the proper type for the value
        let param: ParamConfig;
        if (typeof value === 'number') {
            param = new NumberParamConfig();
        } else if (typeof value === 'boolean') {
            param = new BooleanParamConfig();
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

export class NumberParamConfig extends ParamConfig {
    min = 0;
    max = 1;
    step = 0.01;
    liveUpdates = true;
    style = 'slider'; // todo: enum
    options: string[] = [];
}

export class BooleanParamConfig extends ParamConfig {
    enables: string[] = [];
}

// todo: other param types
