export class ParamConfig {
    name = 'Untitled';
    section: string | undefined;

    constructor(name?: string) {
        if (name) this.name = name;
    }

    static from(value: unknown, config?: unknown): ParamConfig {
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
        if (config) {
            // Check all config fields to make sure they're supported
            const configKeys = Object.getOwnPropertyNames(config);
            for (const key of configKeys) {
                if (Object.getOwnPropertyNames(param).indexOf(key) < 0) {
                    throw new Error(`Unsupported param config field: ${key}`);
                }
            }
            // Assign the config fields to the param
            Object.assign(param, config);
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
