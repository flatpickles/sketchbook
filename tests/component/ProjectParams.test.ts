import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import ProjectParams from '$lib/components/ProjectParams.svelte';
import Project from '$lib/base/Project';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
import { type ParamConfig, ParamType } from '$lib/base/ParamConfig/ParamConfig';

class TestProject extends Project {
    testNumber = 42;
    testBoolean = true;
    testString = 'hello';
    testNumericArray = [1, 2, 3];
    testFunction = () => 42;
}

const paramsConfig: ParamConfig[] = [
    {
        type: ParamType.Number,
        key: 'testNumber',
        name: 'Test Number',
        liveUpdates: true
    },
    {
        type: ParamType.Boolean,
        key: 'testBoolean',
        name: 'Test Boolean',
        liveUpdates: true
    },
    {
        type: ParamType.String,
        key: 'testString',
        name: 'Test String',
        liveUpdates: true
    },
    {
        type: ParamType.NumericArray,
        key: 'testNumericArray',
        name: 'Test Numeric Array',
        liveUpdates: true
    },
    {
        type: ParamType.Function,
        key: 'testFunction',
        name: 'Test Function',
        liveUpdates: true
    }
];

const testTuple: ProjectTuple = {
    project: new TestProject(),
    props: ProjectConfigDefaults,
    params: paramsConfig
};

describe('ProjectParams', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders param label names properly, in order', async () => {
        render(ProjectParams, {
            projectTuple: testTuple
        });
        const labelItems = screen.getAllByTestId('param-label');
        expect(labelItems.length).toBe(5);
        expect(labelItems[0].textContent).toContain('Test Number');
        expect(labelItems[1].textContent).toContain('Test Boolean');
        expect(labelItems[2].textContent).toContain('Test String');
        expect(labelItems[3].textContent).toContain('Test Numeric Array');
        expect(labelItems[4].textContent).toContain('Test Function');
    });

    it('renders param values properly', async () => {
        render(ProjectParams, {
            projectTuple: testTuple
        });
        const numberInput = screen.getByTestId('number-param-input') as HTMLInputElement;
        expect(numberInput).toBeDefined();
        expect(numberInput.value).toBe('42');
        const booleanInput = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(booleanInput).toBeDefined();
        expect(booleanInput.checked).toBe(true);
        const stringInput = screen.getByTestId('string-param-input') as HTMLInputElement;
        expect(stringInput).toBeDefined();
        expect(stringInput.value).toBe('hello');
        const numericArrayInput = screen.getAllByTestId(
            'numeric-array-param-input'
        ) as HTMLInputElement[];
        expect(numericArrayInput.length).toBe(3);
        expect(numericArrayInput[0].value).toBe('1');
        expect(numericArrayInput[1].value).toBe('2');
        expect(numericArrayInput[2].value).toBe('3');
        const functionInput = screen.getByTestId('function-param-input') as HTMLInputElement;
        expect(functionInput).toBeDefined();
    });

    it('updates a number param when the input changes', async () => {
        // todo
    });

    // todo: other parameter types
});
