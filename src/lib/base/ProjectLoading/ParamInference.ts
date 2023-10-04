import type { ParamConfig } from '../ConfigModels/ParamConfig';

export type InferenceReturn = {
    configs: ParamConfig[];
    values: Record<string, unknown>;
};

export enum InferenceMode {
    ProjectFile,
    ShaderFile
}

export default class ParamInference {
    static paramsWithInference(
        initialConfigs: ParamConfig[],
        rawFileText: string,
        mode: InferenceMode
    ): InferenceReturn {
        // TODO: Implement
        return {
            configs: initialConfigs,
            values: {}
        };
    }
}
