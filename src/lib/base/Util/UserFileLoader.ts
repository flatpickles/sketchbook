import { FileReaderMode } from '../ParamConfig/FileParamConfig';

export default class UserFileLoader {
    public static loadFile(file: File, mode: FileReaderMode): Promise<string | ArrayBuffer> {
        return new Promise((resolve, reject) => {
            // Create a FileReader and set up callbacks
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    resolve(reader.result);
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
                default:
                    reject(new Error(`Unsupported FileReader mode: ${mode}`));
            }
        });
    }

    public static loadFiles(
        files: File[],
        mode: FileReaderMode
    ): Promise<(string | ArrayBuffer)[]> {
        return Promise.all(files.map((file) => UserFileLoader.loadFile(file, mode)));
    }
}
