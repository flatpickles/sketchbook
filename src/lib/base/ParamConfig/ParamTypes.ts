import { isBooleanParamConfig, type BooleanParamConfig } from './BooleanParamConfig';
import { isNumberParamConfig, type NumberParamConfig } from './NumberParamConfig';

export type ParamValueType<T> = T extends NumberParamConfig
    ? number
    : T extends BooleanParamConfig
    ? boolean
    : never;

export const ParamGuards = {
    isNumberParamConfig,
    isBooleanParamConfig
};
