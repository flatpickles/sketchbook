import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import FileInput from '$lib/components/ParamItem/FileInput.svelte';

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
            multiple: false,
            accept: 'image/*'
        });
        let fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        expect(fileInput).toBeDefined();
        expect(fileInput.multiple).toBe(false);
        expect(fileInput.accept).toBe('image/*');

        // Check with multiple true
        rerender({
            multiple: true,
            accept: 'image/*'
        });
        fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        expect(fileInput).toBeDefined();
        expect(fileInput.multiple).toBe(true);
        expect(fileInput.accept).toBe('image/*');
    });

    it('updates state properly with file input', async () => {
        const { component } = render(FileInput, {
            multiple: true,
            accept: 'image/*'
        });

        // Check initial file name
        const fileName = screen.getByTestId('file-name-field') as HTMLInputElement;
        expect(fileName).toBeDefined();
        expect(fileName.value).toBe('Select file...');

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
        await waitFor(() => expect(fileName.value).toBe('Select file...'));
    });
});
