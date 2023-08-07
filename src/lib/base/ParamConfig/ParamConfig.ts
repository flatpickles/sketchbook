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

export type ParamSection = {
    name: string;
    params: ParamConfig[];
};

export function getParamSections(params: ParamConfig[]): [ParamConfig[], ParamSection[]] {
    const noSection: ParamConfig[] = [];
    const sections: Record<string, ParamSection> = {};
    for (const param of params) {
        if (param.section) {
            if (!sections[param.section])
                sections[param.section] = {
                    name: param.section,
                    params: []
                };
            sections[param.section].params.push(param);
        } else {
            noSection.push(param);
        }
    }
    return [noSection, Object.values(sections)];
}
