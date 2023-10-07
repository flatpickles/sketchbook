import { isBooleanParamConfig, type BooleanParamConfig } from './ParamConfigs/BooleanParamConfig';
import { isNumberParamConfig, type NumberParamConfig } from './ParamConfigs/NumberParamConfig';
import {
    isFunctionParamConfig,
    type FunctionParamConfig
} from './ParamConfigs/FunctionParamConfig';
import { isStringParamConfig, type StringParamConfig } from './ParamConfigs/StringParamConfig';
import {
    isNumericArrayParamConfig,
    type NumericArrayParamConfig
} from './ParamConfigs/NumericArrayParamConfig';
import { isFileParamConfig, type FileParamConfig } from './ParamConfigs/FileParamConfig';
import type { ParamConfig } from './ParamConfig';

/*
    File loading result types vary depending on the parameter configuration's read mode
    and whether the parameter is set to accept multiple files.
*/
export type SingleFileResultType = string | ArrayBuffer | HTMLImageElement;
export type MultipleFileResultType = SingleFileResultType[];
export type FileResultType = SingleFileResultType | MultipleFileResultType;
export type FileMetadataType = File | File[];
export type UserFileLoaderReturnType = {
    result: FileResultType;
    metadata: FileMetadataType;
};

/*
    AnyParamValueType is all possible parameter types, including undefined.
*/
export type AnyParamValueType = number | boolean | string | number[] | undefined;

/*
    ParamValueType is used to determine the type of the parameter value
    based on the parameter configuration.
*/
export type ParamValueType<T> = T extends NumberParamConfig
    ? number
    : T extends BooleanParamConfig
    ? boolean
    : T extends StringParamConfig
    ? string
    : T extends NumericArrayParamConfig
    ? number[]
    : T extends FunctionParamConfig | FileParamConfig
    ? undefined
    : never;

/*
    Only some param config types can have a default value:
*/
function isConfigTypeWithDefault(
    param: ParamConfig
): param is NumberParamConfig | BooleanParamConfig | StringParamConfig | NumericArrayParamConfig {
    return (
        isNumberParamConfig(param) ||
        isBooleanParamConfig(param) ||
        isStringParamConfig(param) ||
        isNumericArrayParamConfig(param)
    );
}

/*
    Consolidate all parameter configuration types here for easy importing elsewhere.
*/
export const ParamGuards = {
    isNumberParamConfig,
    isBooleanParamConfig,
    isFunctionParamConfig,
    isStringParamConfig,
    isNumericArrayParamConfig,
    isFileParamConfig,
    isConfigTypeWithDefault
};
