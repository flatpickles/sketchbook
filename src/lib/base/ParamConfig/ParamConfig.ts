export enum ParamType {
    Undefined = 'undefined',
    Number = 'number',
    Boolean = 'boolean',
    Function = 'function',
    String = 'string'
}

export interface ParamConfig {
    type: ParamType;
    key: string;
    name: string;
    section?: string;
}

export const ParamConfigDefaults: ParamConfig = {
    type: ParamType.Undefined,
    key: 'untitled-param',
    name: 'Untitled Param',
    section: undefined
} as const;
