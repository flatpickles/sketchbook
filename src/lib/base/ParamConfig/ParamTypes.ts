import { isBooleanParamConfig, type BooleanParamConfig } from './BooleanParamConfig';
import { isNumberParamConfig, type NumberParamConfig } from './NumberParamConfig';
import { isFunctionParamConfig, type FunctionParamConfig } from './FunctionParamConfig';
import { isStringParamConfig, type StringParamConfig } from './StringParamConfig';
import { isNumericArrayParamConfig, type NumericArrayParamConfig } from './NumericArrayParamConfig';
import { isFileParamConfig, type FileParamConfig } from './FileParamConfig';

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
    ParamValueType is used to determine the type of the parameter value
    based on the parameter configuration.
*/
export type ParamValueType<T> = T extends NumberParamConfig
    ? number
    : T extends BooleanParamConfig
    ? boolean
    : T extends FunctionParamConfig
    ? () => void
    : T extends FileParamConfig
    ? (result: UserFileLoaderReturnType) => void
    : T extends StringParamConfig
    ? string
    : T extends NumericArrayParamConfig
    ? number[]
    : never;

/*
    Consolidate all parameter configuration types here for easy importing elsewhere.
*/
export const ParamGuards = {
    isNumberParamConfig,
    isBooleanParamConfig,
    isFunctionParamConfig,
    isStringParamConfig,
    isNumericArrayParamConfig,
    isFileParamConfig
};
