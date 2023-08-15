/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, afterEach } from 'vitest';
import FileParamLoader from '$lib/base/Util/FileParamLoader';
import { FileReaderMode, type FileParamConfig } from '$lib/base/ParamConfig/FileParamConfig';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';

/**
 * FileReader seems particularly hard to mock, so we're going to mock each
 * method we need to use in order to test FileParamLoader, with each different
 * mode of FileReader.
 */

// ArrayBuffer mocks

const mockArrayBufferFile = {
    name: 'ArrayBufferFile',
    contents: 'array buffer contents',
    fileObject: new File([''], 'array buffer contents')
};

const mockArrayBufferFileList: unknown = {
    0: mockArrayBufferFile.fileObject,
    length: 1,
    item: () => mockArrayBufferFile.fileObject
};

vi.spyOn(FileReader.prototype, 'readAsArrayBuffer').mockImplementation(function () {
    // @ts-ignore - allow implicit any & outer value shadowing
    Object.defineProperty(this, 'result', { value: mockArrayBufferFile.contents });
    // @ts-ignore - allow implicit any & outer value shadowing
    this.onload?.call(this);
});

// Binary string mocks

const mockBinaryStringFile = {
    name: 'BinaryStringFile',
    contents: 'binary string contents',
    fileObject: new File([''], 'binary string contents')
};

const mockBinaryStringFileList: unknown = {
    0: mockBinaryStringFile.fileObject,
    length: 1,
    item: () => mockBinaryStringFile.fileObject
};

vi.spyOn(FileReader.prototype, 'readAsBinaryString').mockImplementation(function () {
    // @ts-ignore - allow implicit any & outer value shadowing
    Object.defineProperty(this, 'result', { value: mockBinaryStringFile.contents });
    // @ts-ignore - allow implicit any & outer value shadowing
    this.onload?.call(this);
});

// Data URL mocks

const mockDataURLFile = {
    name: 'DataURLFile',
    contents: 'data url contents',
    fileObject: new File([''], 'data url contents')
};

const mockDataURLFileList: unknown = {
    0: mockDataURLFile.fileObject,
    length: 1,
    item: () => mockDataURLFile.fileObject
};

vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function () {
    // @ts-ignore - allow implicit any & outer value shadowing
    Object.defineProperty(this, 'result', { value: mockDataURLFile.contents });
    // @ts-ignore - allow implicit any & outer value shadowing
    this.onload?.call(this);
});

// Text mocks

const mockTextFile = {
    name: 'TextFile',
    contents: 'text contents',
    fileObject: new File([''], 'text contents')
};

const mockTextFileList: unknown = {
    0: mockTextFile.fileObject,
    length: 1,
    item: () => mockTextFile.fileObject
};

vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function () {
    // @ts-ignore - allow implicit any & outer value shadowing
    Object.defineProperty(this, 'result', { value: mockTextFile.contents });
    // @ts-ignore - allow implicit any & outer value shadowing
    this.onload?.call(this);
});

// Multiple file mock (w/ ArrayBuffer only)

const mockMultipleFileList: unknown = {
    0: mockArrayBufferFile.fileObject,
    1: mockArrayBufferFile.fileObject,
    2: mockArrayBufferFile.fileObject,
    3: mockArrayBufferFile.fileObject,
    length: 4,
    item: () => mockArrayBufferFile.fileObject
};

/**
 * Now the actual tests! Testing each mode as a single file read, and then
 * testing multiple files with only the ArrayBuffer mode; should still give
 * us good coverage.
 */

describe('FileParamLoader', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('loads a file w/ FileReaderMode.ArrayBuffer', async () => {
        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: false,
            mode: FileReaderMode.ArrayBuffer,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockArrayBufferFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(false);
        expect(result).toEqual(mockArrayBufferFile.contents);
        expect(Array.isArray(metadata)).toBe(false);
        expect(metadata).toEqual(mockArrayBufferFile.fileObject);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(1);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledWith(
            mockArrayBufferFile.fileObject
        );
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(0);
    });

    it('loads a file w/ FileReaderMode.BinaryString', async () => {
        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: false,
            mode: FileReaderMode.BinaryString,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockBinaryStringFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(false);
        expect(result).toEqual(mockBinaryStringFile.contents);
        expect(Array.isArray(metadata)).toBe(false);
        expect(metadata).toEqual(mockBinaryStringFile.fileObject);
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(1);
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledWith(
            mockBinaryStringFile.fileObject
        );
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(0);
    });

    it('loads a file w/ FileReaderMode.DataURL', async () => {
        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: false,
            mode: FileReaderMode.DataURL,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockDataURLFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(false);
        expect(result).toEqual(mockDataURLFile.contents);
        expect(Array.isArray(metadata)).toBe(false);
        expect(metadata).toEqual(mockDataURLFile.fileObject);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(1);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(mockDataURLFile.fileObject);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(0);
    });

    it('loads a file w/ FileReaderMode.Text', async () => {
        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: false,
            mode: FileReaderMode.Text,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockTextFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(false);
        expect(result).toEqual(mockTextFile.contents);
        expect(Array.isArray(metadata)).toBe(false);
        expect(metadata).toEqual(mockTextFile.fileObject);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(1);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledWith(mockTextFile.fileObject);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(0);
    });

    it('loads a file w/ FileReaderMode.DataURL', async () => {
        // Mock: call onload for new image objects
        global.Image = class {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onload: any;
            constructor() {
                setTimeout(() => {
                    this.onload(); // simulate success
                }, 100);
            }
        } as typeof Image;

        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: false,
            mode: FileReaderMode.Image,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockDataURLFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(false);
        expect((result as HTMLImageElement).src).toEqual(mockDataURLFile.contents);
        expect(Array.isArray(metadata)).toBe(false);
        expect(metadata).toEqual(mockDataURLFile.fileObject);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(1);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(mockDataURLFile.fileObject);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(0);
    });

    it('loads multiple files w/ FileReaderMode.ArrayBuffer', async () => {
        const config: FileParamConfig = {
            accept: 'image/*',
            multiple: true,
            mode: FileReaderMode.ArrayBuffer,
            type: ParamType.File,
            key: 'testFile',
            name: 'testFile',
            liveUpdates: false
        };
        const { result, metadata } = await FileParamLoader.loadFileList(
            mockMultipleFileList as FileList,
            config
        );
        expect(result).toBeDefined();
        expect(metadata).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual([
            mockArrayBufferFile.contents,
            mockArrayBufferFile.contents,
            mockArrayBufferFile.contents,
            mockArrayBufferFile.contents
        ]);
        expect(Array.isArray(metadata)).toBe(true);
        expect(metadata).toEqual([
            mockArrayBufferFile.fileObject,
            mockArrayBufferFile.fileObject,
            mockArrayBufferFile.fileObject,
            mockArrayBufferFile.fileObject
        ]);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledTimes(4);
        expect(FileReader.prototype.readAsArrayBuffer).toHaveBeenCalledWith(
            mockArrayBufferFile.fileObject
        );
        expect(FileReader.prototype.readAsBinaryString).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledTimes(0);
        expect(FileReader.prototype.readAsText).toHaveBeenCalledTimes(0);
    });
});
