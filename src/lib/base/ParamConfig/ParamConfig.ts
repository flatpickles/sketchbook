import { ProjectConfigDefaults } from '../ProjectConfig/ProjectConfig';

export enum ParamType {
    Undefined = 'undefined',
    Number = 'number',
    Boolean = 'boolean',
    Function = 'function',
    String = 'string',
    NumericArray = 'numericArray'
}

export interface ParamConfig {
    type: ParamType;
    key: string;
    name: string;
    liveUpdates: boolean;
    section?: string;
}

export const ParamConfigDefaults: ParamConfig = {
    type: ParamType.Undefined,
    key: 'untitledParam',
    name: 'Untitled Param',
    liveUpdates: ProjectConfigDefaults.liveUpdates,
    section: undefined
} as const;
