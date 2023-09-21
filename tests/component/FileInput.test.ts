import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import FileInput from '$lib/components/Inputs/FileInput.svelte';

const mockFiles = [
    {
        name: 'testFile1',
        contents: 'testFile1 contents',
        fileObject: new File([''], 'testFile1')
    },
    {
        name: 'testFile2',
        contents: 'testFile2 contents',
        fileObject: new File([''], 'testFile2')
    }
];

const fileListMockNone = {
    length: 0,
    item: () => undefined
};

const fileListMockMultiple = {
    length: mockFiles.length,
    item: (idx: number) => mockFiles[idx].fileObject
};

const fileListMockSingle = {
    length: 1,
    item: () => new File([''], 'testFile')
};

describe('FileInput', () => {
    afterEach(cleanup);

    it('renders properly', () => {
        // Check with multiple false
        const { rerender } = render(FileInput, {
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: 'image/*'
        });
        let fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        expect(fileInput).toBeDefined();
        expect(fileInput.multiple).toBe(false);
        expect(fileInput.accept).toBe('image/*');
        let fileName = screen.getByTestId('file-name-field') as HTMLInputElement;
        expect(fileName).toBeDefined();
        expect(fileName.value).toBe('Select file...');

        // Check with multiple true
        rerender({
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: true,
            accept: 'image/*'
        });
        fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        expect(fileInput).toBeDefined();
        expect(fileInput.multiple).toBe(true);
        expect(fileInput.accept).toBe('image/*');
        fileName = screen.getByTestId('file-name-field') as HTMLInputElement;
        expect(fileName).toBeDefined();
        expect(fileName.value).toBe('Select files...');
    });

    it('renders icons depending on file type', () => {
        // Check with no specific type
        const { rerender } = render(FileInput, {
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: '*'
        });
        let fileButton = screen.getByTestId('file-selector-button').firstChild as HTMLElement;
        expect(fileButton.classList.contains('fa-file')).toBe(true);

        // Check with image type
        rerender({
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: 'image/*'
        });
        fileButton = screen.getByTestId('file-selector-button').firstChild as HTMLElement;
        expect(fileButton.classList.contains('fa-file-image')).toBe(true);

        // Check with video type
        rerender({
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: 'video/*'
        });
        fileButton = screen.getByTestId('file-selector-button').firstChild as HTMLElement;
        expect(fileButton.classList.contains('fa-file-video')).toBe(true);

        // Check with audio type
        rerender({
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: 'audio/*'
        });
        fileButton = screen.getByTestId('file-selector-button').firstChild as HTMLElement;
        expect(fileButton.classList.contains('fa-file-audio')).toBe(true);

        // Check with mixed type
        rerender({
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: false,
            accept: 'video/*, image/*'
        });
        fileButton = screen.getByTestId('file-selector-button').firstChild as HTMLElement;
        expect(fileButton.classList.contains('fa-file')).toBe(true);
    });

    it('updates state properly with file input (none, one, multiple selected)', async () => {
        const { component } = render(FileInput, {
            name: 'testFileInput',
            id: 'testFileInput',
            multiple: true,
            accept: 'image/*'
        });

        // Check initial file name
        const fileName = screen.getByTestId('file-name-field') as HTMLInputElement;
        expect(fileName).toBeDefined();
        expect(fileName.value).toBe('Select files...');

        // Check multiple file input
        const fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        fireEvent.change(fileInput, {
            target: { files: fileListMockMultiple }
        });
        expect(component.selectedFiles).toEqual(fileListMockMultiple);
        await waitFor(() => expect(fileName.value).toBe('Multiple selected'));

        // Check single file input
        fireEvent.change(fileInput, {
            target: { files: fileListMockSingle }
        });
        expect(component.selectedFiles).toEqual(fileListMockSingle);
        await waitFor(() => expect(fileName.value).toBe('testFile'));

        // Check no input
        fireEvent.change(fileInput, {
            target: { files: fileListMockNone }
        });
        expect(component.selectedFiles).toEqual(fileListMockNone);
        await waitFor(() => expect(fileName.value).toBe('Select files...'));
    });
});
