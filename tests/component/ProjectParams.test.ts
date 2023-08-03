import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ProjectParams from '$lib/components/ProjectParams.svelte';
import Project from '$lib/base/Project';
import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig/ProjectConfigFactory';

class TestProject extends Project {
    testNumber = 42;
    testBoolean = true;
    testString = 'hello';
    testNumericArray = [1, 2, 3];
    testFunction = () => 42;
}

function paramsWithLiveUpdates(liveUpdates = true) {
    return [
        {
            type: ParamType.Number,
            key: 'testNumber',
            name: 'Test Number',
            liveUpdates: liveUpdates
        },
        {
            type: ParamType.Boolean,
            key: 'testBoolean',
            name: 'Test Boolean',
            liveUpdates: liveUpdates
        },
        {
            type: ParamType.String,
            key: 'testString',
            name: 'Test String',
            liveUpdates: liveUpdates
        },
        {
            type: ParamType.NumericArray,
            key: 'testNumericArray',
            name: 'Test Numeric Array',
            liveUpdates: liveUpdates
        },
        {
            type: ParamType.Function,
            key: 'testFunction',
            name: 'Test Function',
            liveUpdates: liveUpdates
        }
    ];
}

function renderParams(liveUpdates = true): TestProject {
    const testProject = new TestProject();
    const testProjectConfig = ProjectConfigFactory.propsFrom({
        liveUpdates: liveUpdates
    });
    const testTuple: ProjectTuple = {
        project: testProject,
        props: testProjectConfig,
        params: paramsWithLiveUpdates(liveUpdates)
    };
    render(ProjectParams, {
        projectTuple: testTuple
    });
    return testProject;
}

describe('ProjectParams list', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders param label names properly, in order', async () => {
        renderParams();
        const labelItems = screen.getAllByTestId('param-label');
        expect(labelItems.length).toBe(5);
        expect(labelItems[0].textContent).toContain('Test Number');
        expect(labelItems[1].textContent).toContain('Test Boolean');
        expect(labelItems[2].textContent).toContain('Test String');
        expect(labelItems[3].textContent).toContain('Test Numeric Array');
        expect(labelItems[4].textContent).toContain('Test Function');
    });

    it('renders param default values properly', async () => {
        renderParams();
        const booleanInput = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(booleanInput).toBeDefined();
        expect(booleanInput.checked).toBe(true);
        const stringInput = screen.getByTestId('string-param-input') as HTMLInputElement;
        expect(stringInput).toBeDefined();
        expect(stringInput.value).toBe('hello');
        const functionInput = screen.getByTestId('function-param-input') as HTMLInputElement;
        expect(functionInput).toBeDefined();

        // Both single & array numeric inputs are rendered
        const numberInputs = screen.getAllByTestId('number-param-input') as HTMLInputElement[];
        expect(numberInputs.length).toBe(4);
        expect(numberInputs[0].value).toBe('42');
        expect(numberInputs[1].value).toBe('1');
        expect(numberInputs[2].value).toBe('2');
        expect(numberInputs[3].value).toBe('3');
    });
});

describe('number param input', () => {
    afterEach(() => {
        cleanup();
    });

    it('updates a number param when the input changes (liveUpdates)', async () => {
        const project = renderParams(true);
        vi.spyOn(project, 'update');
        const numberInput = screen.getAllByTestId('number-param-input')[0] as HTMLInputElement;
        expect(numberInput.value).toBe('42');
        expect(project.testNumber).toBe(42);
        fireEvent.input(numberInput, { target: { value: '43' } });
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(numberInput.value).toBe('43');
        expect(project.testNumber).toBe(43);
        fireEvent.change(numberInput, { target: { value: '44' } });
        expect(project.update).toHaveBeenCalledTimes(2);
        expect(numberInput.value).toBe('44');
        expect(project.testNumber).toBe(44);
    });

    it('updates a number param when the input changes (!liveUpdates)', async () => {
        const project = renderParams(false);
        vi.spyOn(project, 'update');
        const numberInput = screen.getAllByTestId('number-param-input')[0] as HTMLInputElement;
        expect(numberInput.value).toBe('42');
        expect(project.testNumber).toBe(42);
        fireEvent.input(numberInput, { target: { value: '43' } });
        expect(project.update).toHaveBeenCalledTimes(0);
        expect(numberInput.value).toBe('43');
        expect(project.testNumber).toBe(42);
        fireEvent.change(numberInput, { target: { value: '44' } });
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(numberInput.value).toBe('44');
        expect(project.testNumber).toBe(44);
    });
});

describe('boolean param input', () => {
    afterEach(() => {
        cleanup();
    });

    it('updates a boolean param when the input changes', async () => {
        const project = renderParams(true);
        vi.spyOn(project, 'update');
        const booleanInput = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(booleanInput.checked).toBe(true);
        expect(project.testBoolean).toBe(true);
        fireEvent.click(booleanInput);
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(booleanInput.checked).toBe(false);
        expect(project.testBoolean).toBe(false);
    });
});

describe('string param input', () => {
    afterEach(() => {
        cleanup();
    });

    it('updates a string param when the input changes (liveUpdates)', async () => {
        const project = renderParams(true);
        vi.spyOn(project, 'update');
        const stringInput = screen.getByTestId('string-param-input') as HTMLInputElement;
        expect(stringInput.value).toBe('hello');
        expect(project.testString).toBe('hello');
        fireEvent.input(stringInput, { target: { value: 'goodbye' } });
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('goodbye');
        fireEvent.blur(stringInput);
        expect(project.update).toHaveBeenCalledTimes(2);
    });

    it('updates a string param when the input changes (!liveUpdates)', async () => {
        const project = renderParams(false);
        vi.spyOn(project, 'update');
        const stringInput = screen.getByTestId('string-param-input') as HTMLInputElement;
        expect(stringInput.value).toBe('hello');
        expect(project.testString).toBe('hello');
        fireEvent.input(stringInput, { target: { value: 'goodbye' } });
        expect(project.update).toHaveBeenCalledTimes(0);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('hello');
        fireEvent.blur(stringInput);
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(stringInput.value).toBe('goodbye');
        expect(project.testString).toBe('goodbye');
    });
});

describe('numeric array param input', () => {
    afterEach(() => {
        cleanup();
    });

    it('updates a numeric array param when the input changes (liveUpdates)', async () => {
        const project = renderParams(true);
        vi.spyOn(project, 'update');
        const numericArrayInput = screen.getAllByTestId('number-param-input') as HTMLInputElement[];
        numericArrayInput.shift(); // first is the non-array numeric input
        expect(numericArrayInput.length).toBe(3);
        expect(numericArrayInput[0].value).toBe('1');
        expect(numericArrayInput[1].value).toBe('2');
        expect(numericArrayInput[2].value).toBe('3');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.input(numericArrayInput[0], { target: { value: '4' } });
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(numericArrayInput[0].value).toBe('4');
        expect(project.testNumericArray).toEqual([4, 2, 3]);
        fireEvent.change(numericArrayInput[1], { target: { value: '5' } });
        expect(project.update).toHaveBeenCalledTimes(2);
        expect(numericArrayInput[1].value).toBe('5');
        expect(project.testNumericArray).toEqual([4, 5, 3]);
    });

    it('updates a numeric array param when the input changes (!liveUpdates)', async () => {
        const project = renderParams(false);
        vi.spyOn(project, 'update');
        const numericArrayInput = screen.getAllByTestId('number-param-input') as HTMLInputElement[];
        numericArrayInput.shift(); // first is the non-array numeric input
        expect(numericArrayInput.length).toBe(3);
        expect(numericArrayInput[0].value).toBe('1');
        expect(numericArrayInput[1].value).toBe('2');
        expect(numericArrayInput[2].value).toBe('3');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.input(numericArrayInput[0], { target: { value: '4' } });
        expect(project.update).toHaveBeenCalledTimes(0);
        expect(numericArrayInput[0].value).toBe('4');
        expect(project.testNumericArray).toEqual([1, 2, 3]);
        fireEvent.change(numericArrayInput[1], { target: { value: '5' } });
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(numericArrayInput[1].value).toBe('5');
        expect(project.testNumericArray).toEqual([4, 5, 3]);
    });
});

describe('function param input', () => {
    afterEach(() => {
        cleanup();
    });

    it('calls a param-ized function when the button is clicked', async () => {
        const project = renderParams(true);
        vi.spyOn(project, 'update');
        vi.spyOn(project, 'testFunction');
        const functionButton = screen.getByTestId('function-param-input');
        expect(project.testFunction).toHaveBeenCalledTimes(0);
        fireEvent.click(functionButton);
        expect(project.testFunction).toHaveBeenCalledTimes(1);
        expect(project.update).toHaveBeenCalledTimes(1);
    });
});
