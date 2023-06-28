export class ParamConfig {
    name = 'Untitled';
    section: string | undefined;

    constructor(name?: string) {
        if (name) this.name = name;
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
