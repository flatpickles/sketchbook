import { FileReaderMode, type FileParamConfig } from '../ParamConfig/FileParamConfig';
import type {
    UserFileLoaderReturnType,
    FileResultType,
    FileMetadataType,
    SingleFileResultType,
    MultipleFileResultType
} from '../ParamConfig/ParamTypes';

export default class FileParamLoader {
    /**
     * Loads the files from a FileList object.
     * @param files - the FileList object produced by a file input element
     * @param paramConfig - the parameter configuration for the file input
     * @returns - the result and metadata to be used in a file selection parameter callback
     */
    public static async loadFileList(
        files: FileList,
        paramConfig: FileParamConfig
    ): Promise<UserFileLoaderReturnType> {
        const fileArray = Array.from(files);
        let loadedFiles: FileResultType;
        let fileMetadata: FileMetadataType;
        if (!paramConfig.multiple) {
            fileMetadata = files[0];
            loadedFiles = await FileParamLoader.#loadFile(fileArray[0], paramConfig.mode);
        } else {
            fileMetadata = fileArray;
            loadedFiles = await FileParamLoader.#loadFiles(fileArray, paramConfig.mode);
        }
        return { result: loadedFiles, metadata: fileMetadata };
    }

    /**
     * Internal helper function used to load a single file.
     * FileReader reference: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
     * @param file - the file to load
     * @param mode - the read mode to use, currently via to FileReader methods (see reference)
     * @returns - the result of the file read
     */
    static #loadFile(file: File, mode: FileReaderMode): Promise<SingleFileResultType> {
        return new Promise((resolve, reject) => {
            // Create a FileReader and set up callbacks
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    if (mode != FileReaderMode.Image) {
                        // Resolve directly with the file reader result
                        resolve(reader.result);
                    } else {
                        // Read the image into a new HTMLImageElement object
                        const img = new Image();
                        img.onload = () => {
                            resolve(img);
                        };
                        img.onerror = () => {
                            reject(new Error("Couldn't create image from FileReader result"));
                        };
                        img.src = reader.result as string;
                    }
                } else {
                    reject(new Error('FileReader result was undefined'));
                }
            };
            reader.onerror = () => {
                reject(reader.error);
            };

            // Read according to the current mode
            switch (mode) {
                case FileReaderMode.ArrayBuffer:
                    reader.readAsArrayBuffer(file);
                    break;
                case FileReaderMode.BinaryString:
                    reader.readAsBinaryString(file);
                    break;
                case FileReaderMode.DataURL:
                    reader.readAsDataURL(file);
                    break;
                case FileReaderMode.Text:
                    reader.readAsText(file);
                    break;
                case FileReaderMode.Image:
                    reader.readAsDataURL(file);
                    break;
                default:
                    reject(new Error(`Unsupported FileReader mode: ${mode}`));
            }
        });
    }

    /**
     * Internal helper function used to load multiple files.
     * @param files - the files to load
     * @param mode - the read mode to use, currently via to FileReader methods (see reference)
     * @returns - the results of the file reads
     */
    static #loadFiles(files: File[], mode: FileReaderMode): Promise<MultipleFileResultType> {
        return Promise.all(files.map((file) => FileParamLoader.#loadFile(file, mode)));
    }
}
