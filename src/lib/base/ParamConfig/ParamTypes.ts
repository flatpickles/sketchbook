import { isBooleanParamConfig, type BooleanParamConfig } from './BooleanParamConfig';
import { isNumberParamConfig, type NumberParamConfig } from './NumberParamConfig';
import { isFunctionParamConfig, type FunctionParamConfig } from './FunctionParamConfig';
import { isStringParamConfig, type StringParamConfig } from './StringParamConfig';

export type ParamValueType<T> = T extends NumberParamConfig
    ? number
    : T extends BooleanParamConfig
    ? boolean
    : T extends FunctionParamConfig
    ? () => void
    : T extends StringParamConfig
    ? string
    : never;

export const ParamGuards = {
    isNumberParamConfig,
    isBooleanParamConfig,
    isFunctionParamConfig,
    isStringParamConfig
};
