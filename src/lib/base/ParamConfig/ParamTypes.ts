import { isBooleanParamConfig, type BooleanParamConfig } from './BooleanParamConfig';
import { isNumberParamConfig, type NumberParamConfig } from './NumberParamConfig';
import { isFunctionParamConfig, type FunctionParamConfig } from './FunctionParamConfig';
import { isStringParamConfig, type StringParamConfig } from './StringParamConfig';
import { isNumericArrayParamConfig, type NumericArrayParamConfig } from './NumericArrayParamConfig';
import { isFileParamConfig, type FileParamConfig } from './FileParamConfig';

export type ParamValueType<T> = T extends NumberParamConfig
    ? number
    : T extends BooleanParamConfig
    ? boolean
    : T extends FunctionParamConfig
    ? () => void
    : T extends FileParamConfig
    ? (result: string | ArrayBuffer) => void
    : T extends StringParamConfig
    ? string
    : T extends NumericArrayParamConfig
    ? number[]
    : never;

export const ParamGuards = {
    isNumberParamConfig,
    isBooleanParamConfig,
    isFunctionParamConfig,
    isStringParamConfig,
    isNumericArrayParamConfig,
    isFileParamConfig
};

export type FileResultParamType = string | ArrayBuffer | (string | ArrayBuffer)[];
export type FileMetadataParamType = File | File[];
