import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ProjectParams from '$lib/components/ProjectParams.svelte';
import Project from '$lib/base/Project/Project';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import { ParamType } from '$lib/base/ConfigModels/ParamConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectLoading/ProjectConfigFactory';

import type { UserFileLoaderReturnType } from '$lib/base/ConfigModels/ParamTypes';
import FileParamLoader from '$lib/base/Util/FileParamLoader';

import ParamValueProvider from '$lib/base/ProjectLoading/ParamValueProvider';
vi.spyOn(ParamValueProvider, 'getValue');
vi.spyOn(ParamValueProvider, 'setValue');

class TestProject extends Project {
    testNumber = 42;
    testBoolean = true;
    testString = 'hello';
    testNumericArray = [1, 2, 3];
    testFunction = () => 42;
    testFile = () => {
        return;
    };
}

enum SectionOption {
    NoSections = 'none', // no params in sections
    SomeSections = 'someSectioned', // some params in sections
    AllSections = 'allSectioned' // all params in sections
}

function paramsWithApplyDuringInput(
    applyDuringInput = true,
    sectionOption: SectionOption = SectionOption.NoSections
) {
    return [
        {
            type: ParamType.Number,
            key: 'testNumber',
            name: 'Test Number',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            style: 'combo',
            section: sectionOption === SectionOption.AllSections ? 'Section 1' : undefined
        },
        {
            type: ParamType.Boolean,
            key: 'testBoolean',
            name: 'Test Boolean',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            section: [SectionOption.SomeSections, SectionOption.AllSections].includes(sectionOption)
                ? 'Section 1'
                : undefined
        },
        {
            type: ParamType.String,
            key: 'testString',
            name: 'Test String',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            style: 'single',
            section: [SectionOption.SomeSections, SectionOption.AllSections].includes(sectionOption)
                ? 'Section 1'
                : undefined
        },
        {
            type: ParamType.NumericArray,
            key: 'testNumericArray',
            name: 'Test Numeric Array',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            style: 'slider',
            section: [SectionOption.SomeSections, SectionOption.AllSections].includes(sectionOption)
                ? 'Section 2'
                : undefined
        },
        {
            type: ParamType.Function,
            key: 'testFunction',
            name: 'Test Function',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            section: [SectionOption.SomeSections, SectionOption.AllSections].includes(sectionOption)
                ? 'Section 2'
                : undefined
        },
        {
            type: ParamType.File,
            key: 'testFile',
            name: 'Test File',
            applyDuringInput: applyDuringInput,
            fullWidthInput: false,
            section: [SectionOption.SomeSections, SectionOption.AllSections].includes(sectionOption)
                ? 'Section 2'
                : undefined
        }
    ];
}

function renderParams(
    applyDuringInput = true,
    sectionOption: SectionOption = SectionOption.NoSections
): { project: TestProject; updateHandler: typeof vi.fn } {
    const project = new TestProject();
    const testProjectConfig = ProjectConfigFactory.propsFrom({
        applyDuringInput: applyDuringInput
    });
    const testTuple: ProjectTuple = {
        key: 'testProject',
        project: project,
        config: testProjectConfig,
        params: paramsWithApplyDuringInput(applyDuringInput, sectionOption)
    };
    const { component } = render(ProjectParams, {
        projectTuple: testTuple
    });

    const updateHandler = vi.fn();
    component.$on('paramupdated', updateHandler);
    expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(0);
    expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(0);
    expect(updateHandler).toHaveBeenCalledTimes(0);
    return { project, updateHandler };
}

function cleanupParams() {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
}

describe('ProjectParams list', () => {
    afterEach(cleanupParams);

    it('renders param items as even/odd correctly (no sections)', async () => {
        renderParams(true, SectionOption.NoSections);

        // Check label wrappers
        const labelWrappers = screen.getAllByTestId('param-label-wrapper');
        expect(labelWrappers.length).toBe(6);
        expect(labelWrappers[0].classList.contains('odd')).toBe(true);
        expect(labelWrappers[1].classList.contains('even')).toBe(true);
        expect(labelWrappers[2].classList.contains('odd')).toBe(true);
        expect(labelWrappers[3].classList.contains('even')).toBe(true);
        expect(labelWrappers[4].classList.contains('odd')).toBe(true);
        expect(labelWrappers[5].classList.contains('even')).toBe(true);

        // Check input wrappers
        const inputWrappers = screen.getAllByTestId('param-input-wrapper');
        expect(inputWrappers.length).toBe(6);
        expect(inputWrappers[0].classList.contains('odd')).toBe(true);
        expect(inputWrappers[1].classList.contains('even')).toBe(true);
        expect(inputWrappers[2].classList.contains('odd')).toBe(true);
        expect(inputWrappers[3].classList.contains('even')).toBe(true);
        expect(inputWrappers[4].classList.contains('odd')).toBe(true);
        expect(inputWrappers[5].classList.contains('even')).toBe(true);
    });

    it('renders param items as even/odd correctly (some in sections)', async () => {
        renderParams(true, SectionOption.SomeSections);

        // Check label wrappers
        const labelWrappers = screen.getAllByTestId('param-label-wrapper');
        expect(labelWrappers.length).toBe(6);
        expect(labelWrappers[0].classList.contains('odd')).toBe(true);
        expect(labelWrappers[1].classList.contains('odd')).toBe(true);
        expect(labelWrappers[2].classList.contains('even')).toBe(true);
        expect(labelWrappers[3].classList.contains('odd')).toBe(true);
        expect(labelWrappers[4].classList.contains('even')).toBe(true);
        expect(labelWrappers[5].classList.contains('odd')).toBe(true);

        // Check input wrappers
        const inputWrappers = screen.getAllByTestId('param-input-wrapper');
        expect(inputWrappers.length).toBe(6);
        expect(inputWrappers[0].classList.contains('odd')).toBe(true);
        expect(inputWrappers[1].classList.contains('odd')).toBe(true);
        expect(inputWrappers[2].classList.contains('even')).toBe(true);
        expect(inputWrappers[3].classList.contains('odd')).toBe(true);
        expect(inputWrappers[4].classList.contains('even')).toBe(true);
        expect(inputWrappers[5].classList.contains('odd')).toBe(true);
    });

    it('renders param items as even/odd correctly (all in sections)', async () => {
        renderParams(true, SectionOption.AllSections);

        // Check label wrappers
        const labelWrappers = screen.getAllByTestId('param-label-wrapper');
        expect(labelWrappers.length).toBe(6);
        expect(labelWrappers[0].classList.contains('odd')).toBe(true);
        expect(labelWrappers[1].classList.contains('even')).toBe(true);
        expect(labelWrappers[2].classList.contains('odd')).toBe(true);
        expect(labelWrappers[3].classList.contains('odd')).toBe(true);
        expect(labelWrappers[4].classList.contains('even')).toBe(true);
        expect(labelWrappers[5].classList.contains('odd')).toBe(true);

        // Check input wrappers
        const inputWrappers = screen.getAllByTestId('param-input-wrapper');
        expect(inputWrappers.length).toBe(6);
        expect(inputWrappers[0].classList.contains('odd')).toBe(true);
        expect(inputWrappers[1].classList.contains('even')).toBe(true);
        expect(inputWrappers[2].classList.contains('odd')).toBe(true);
        expect(inputWrappers[3].classList.contains('odd')).toBe(true);
        expect(inputWrappers[4].classList.contains('even')).toBe(true);
        expect(inputWrappers[5].classList.contains('odd')).toBe(true);
    });

    it('renders param label names properly, in order', async () => {
        renderParams();
        const labelItems = screen.getAllByTestId('param-label');
        expect(labelItems.length).toBe(6);
        expect(labelItems[0].textContent).toContain('Test Number');
        expect(labelItems[1].textContent).toContain('Test Boolean');
        expect(labelItems[2].textContent).toContain('Test String');
        expect(labelItems[3].textContent).toContain('Test Numeric Array');
        expect(labelItems[4].textContent).toContain('Test Function');
        expect(labelItems[5].textContent).toContain('Test File');
    });

    it('renders param default values properly', async () => {
        renderParams();
        const booleanInput = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(booleanInput).toBeDefined();
        expect(booleanInput.checked).toBe(true);
        const stringInput = screen.getByTestId('string-param-input-singleline') as HTMLInputElement;
        expect(stringInput).toBeDefined();
        expect(stringInput.value).toBe('hello');
        const functionInput = screen.getByTestId('function-param-input') as HTMLInputElement;
        expect(functionInput).toBeDefined();
        const fileInput = screen.getByTestId('file-param-input') as HTMLInputElement;
        expect(fileInput).toBeDefined();

        // Both single & array numeric inputs are rendered
        const numberInputSliders = screen.getAllByTestId(
            'number-param-slider'
        ) as HTMLInputElement[];
        expect(numberInputSliders.length).toBe(4);
        expect(numberInputSliders[0].value).toBe('42');
        expect(numberInputSliders[1].value).toBe('1');
        expect(numberInputSliders[2].value).toBe('2');
        expect(numberInputSliders[3].value).toBe('3');
    });
});

describe('ProjectParams sections', () => {
    afterEach(cleanupParams);

    it('renders param sections properly (some params in sections)', async () => {
        renderParams(true, SectionOption.SomeSections);
        const noSectionParams = screen.getByTestId('no-section-params');
        const sectionItems = screen.getAllByTestId('params-section');

        // Check no section params
        expect(noSectionParams).toBeDefined();
        expect(noSectionParams.textContent).toContain('Test Number');
        expect(noSectionParams.nextElementSibling).toBe(sectionItems[0]);

        // Check sections
        expect(sectionItems.length).toBe(2);
        expect(sectionItems[0].textContent).toContain('Section 1');
        expect(sectionItems[1].textContent).toContain('Section 2');
        expect(sectionItems[0].nextElementSibling).toBe(sectionItems[1]);
        expect(sectionItems[1].nextElementSibling).toBeNull();
        expect(sectionItems[0].textContent).toContain('Test Boolean');
        expect(sectionItems[0].textContent).toContain('Test String');
        expect(sectionItems[1].textContent).toContain('Test Numeric Array');
        expect(sectionItems[1].textContent).toContain('Test Function');
    });

    it('renders param sections properly (all params in sections)', async () => {
        renderParams(true, SectionOption.AllSections);
        const sectionItems = screen.getAllByTestId('params-section');
        expect(() => {
            screen.getByTestId('no-section-params');
        }).toThrow();

        // Check sections
        expect(sectionItems.length).toBe(2);
        expect(sectionItems[0].textContent).toContain('Section 1');
        expect(sectionItems[1].textContent).toContain('Section 2');
        expect(sectionItems[0].nextElementSibling).toBe(sectionItems[1]);
        expect(sectionItems[1].nextElementSibling).toBeNull();
        expect(sectionItems[0].textContent).toContain('Test Number');
        expect(sectionItems[0].textContent).toContain('Test Boolean');
        expect(sectionItems[0].textContent).toContain('Test String');
        expect(sectionItems[1].textContent).toContain('Test Numeric Array');
        expect(sectionItems[1].textContent).toContain('Test Function');
    });

    it('renders param sections properly (no params in sections)', async () => {
        renderParams(true, SectionOption.NoSections);
        const noSectionParams = screen.getByTestId('no-section-params');
        expect(() => {
            screen.getAllByTestId('params-section');
        }).toThrow();

        // Check no section params
        expect(noSectionParams).toBeDefined();
        expect(noSectionParams.textContent).toContain('Test Number');
        expect(noSectionParams.nextElementSibling).toBeNull();
    });
});

describe('number param input', () => {
    afterEach(cleanupParams);

    it('updates a number param when the input changes (applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        const numberInput = screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        expect(numberInput.value).toBe('42');
        expect(project.testNumber).toBe(42);
        fireEvent.input(numberInput, { target: { value: '43' } });
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(numberInput.value).toBe('43');
        expect(project.testNumber).toBe(43);
        fireEvent.change(numberInput, { target: { value: '44' } });
        expect(updateHandler).toHaveBeenCalledTimes(2);
        expect(numberInput.value).toBe('44');
        expect(project.testNumber).toBe(44);
        expect(updateHandler).toHaveBeenCalledTimes(2);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testNumber'
                }
            })
        );
    });

    it('updates a number param when the input changes (!applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(false);
        vi.spyOn(project, 'update');
        const numberInput = screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        expect(numberInput.value).toBe('42');
        expect(project.testNumber).toBe(42);
        fireEvent.input(numberInput, { target: { value: '43' } });
        expect(updateHandler).toHaveBeenCalledTimes(0);
        expect(numberInput.value).toBe('43');
        expect(project.testNumber).toBe(42);
        fireEvent.change(numberInput, { target: { value: '44' } });
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(numberInput.value).toBe('44');
        expect(project.testNumber).toBe(44);
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(1);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testNumber'
                }
            })
        );
    });
});

describe('boolean param input', () => {
    afterEach(cleanupParams);

    it('updates a boolean param when the input changes', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        const booleanInput = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(booleanInput.checked).toBe(true);
        expect(project.testBoolean).toBe(true);
        fireEvent.click(booleanInput);
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(booleanInput.checked).toBe(false);
        expect(project.testBoolean).toBe(false);
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(1);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testBoolean'
                }
            })
        );
    });
});

describe('string param input', () => {
    afterEach(cleanupParams);

    it('updates a string param when the input changes (applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        const stringInput = screen.getByTestId('string-param-input-singleline') as HTMLInputElement;
        expect(stringInput.value).toBe('hello');
        expect(project.testString).toBe('hello');
        fireEvent.input(stringInput, { target: { value: 'goodbye' } });
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('goodbye');
        fireEvent.change(stringInput);
        expect(updateHandler).toHaveBeenCalledTimes(2);
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(2);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testString'
                }
            })
        );
    });

    it('updates a string param when the input changes (!applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(false);
        vi.spyOn(project, 'update');
        const stringInput = screen.getByTestId('string-param-input-singleline') as HTMLInputElement;
        expect(stringInput.value).toBe('hello');
        expect(project.testString).toBe('hello');
        fireEvent.input(stringInput, { target: { value: 'goodbye' } });
        expect(updateHandler).toHaveBeenCalledTimes(0);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('hello');
        fireEvent.change(stringInput);
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('goodbye');
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(1);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testString'
                }
            })
        );
    });
});

describe('numeric array param input', () => {
    afterEach(cleanupParams);

    it('updates a numeric array param when the input changes (applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        const numericArrayInput = screen.getAllByTestId(
            'number-param-slider'
        ) as HTMLInputElement[];
        numericArrayInput.shift(); // first is the non-array numeric input
        expect(numericArrayInput.length).toBe(3);
        expect(numericArrayInput[0].value).toBe('1');
        expect(numericArrayInput[1].value).toBe('2');
        expect(numericArrayInput[2].value).toBe('3');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.input(numericArrayInput[0], { target: { value: '4' } });
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(numericArrayInput[0].value).toBe('4');
        expect(project.testNumericArray).toEqual([4, 2, 3]);
        fireEvent.change(numericArrayInput[1], { target: { value: '5' } });
        expect(updateHandler).toHaveBeenCalledTimes(2);
        expect(numericArrayInput[1].value).toBe('5');
        expect(project.testNumericArray).toEqual([4, 5, 3]);
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(2);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testNumericArray'
                }
            })
        );
    });

    it('updates a numeric array param when the input changes (!applyDuringInput)', async () => {
        const { project, updateHandler } = renderParams(false);
        vi.spyOn(project, 'update');
        const numericArrayInput = screen.getAllByTestId(
            'number-param-slider'
        ) as HTMLInputElement[];
        numericArrayInput.shift(); // first is the non-array numeric input
        expect(numericArrayInput.length).toBe(3);
        expect(numericArrayInput[0].value).toBe('1');
        expect(numericArrayInput[1].value).toBe('2');
        expect(numericArrayInput[2].value).toBe('3');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.input(numericArrayInput[0], { target: { value: '4' } });
        expect(updateHandler).toHaveBeenCalledTimes(0);
        expect(numericArrayInput[0].value).toBe('4');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.change(numericArrayInput[1], { target: { value: '5' } });
        expect(updateHandler).toHaveBeenCalledTimes(1);
        expect(numericArrayInput[1].value).toBe('5');
        expect(project.testNumericArray).toEqual([4, 5, 3]);
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(1);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testNumericArray'
                }
            })
        );
    });
});

describe('function param input', () => {
    afterEach(cleanupParams);

    it('calls a param-ized function when the button is clicked', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        vi.spyOn(project, 'testFunction');
        const functionButton = screen.getByTestId('function-param-input');
        expect(project.testFunction).toHaveBeenCalledTimes(0);
        fireEvent.click(functionButton);
        await waitFor(() => expect(project.testFunction).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(updateHandler).toHaveBeenCalledTimes(1));
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(0);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testFunction'
                }
            })
        );
    });
});

describe('file param input', () => {
    afterEach(cleanupParams);

    // Mocking stuff!

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
    const mockFileContents = mockFiles.map((file) => file.contents);

    vi.spyOn(FileParamLoader, 'loadFileList').mockImplementation(
        (fileList: FileList): Promise<UserFileLoaderReturnType> => {
            const fileArray: File[] = [];
            for (let i = 0; i < fileList.length; i++) {
                const item = fileList.item(i);
                if (item) fileArray.push(item);
            }
            return Promise.resolve({
                result: mockFileContents,
                metadata: fileArray
            });
        }
    );

    const fileListMock = {
        length: mockFiles.length,
        item: (idx: number) => mockFiles[idx].fileObject
    };

    // Actual tests...

    it('attempts to load files when the input changes', async () => {
        const { project, updateHandler } = renderParams(true);
        vi.spyOn(project, 'update');
        vi.spyOn(project, 'testFile');
        const fileInput = screen.getByTestId('native-file-input') as HTMLInputElement;
        fireEvent.change(fileInput, {
            target: { files: fileListMock }
        });
        await waitFor(() =>
            expect(project.testFile).toHaveBeenCalledWith(
                mockFileContents,
                mockFiles.map((file) => file.fileObject)
            )
        );
        await waitFor(() => expect(updateHandler).toHaveBeenCalledTimes(1));
        expect(ParamValueProvider.setValue).toHaveBeenCalledTimes(0);

        // Validate paramupdated event
        expect(updateHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: {
                    updatedProject: project,
                    paramKey: 'testFile'
                }
            })
        );
    });
});
