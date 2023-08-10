import { type ParamConfig, ParamType, ParamConfigDefaults } from './ParamConfig';

export enum FileReaderMode {
    ArrayBuffer = 'arrayBuffer',
    BinaryString = 'binaryString',
    DataURL = 'dataURL',
    Text = 'text'
}

export interface FileParamConfig extends ParamConfig {
    accept: string;
    multiple: boolean;
    mode: FileReaderMode;
}

export const FileParamConfigDefaults: FileParamConfig = {
    ...ParamConfigDefaults,
    type: ParamType.File,
    accept: '*',
    multiple: false,
    mode: FileReaderMode.DataURL
} as const;

export function isFileParamConfig(param: ParamConfig): param is FileParamConfig {
    return param.type === ParamType.File;
}
