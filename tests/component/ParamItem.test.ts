/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import ParamItem from '$lib/components/ParamItem/ParamItem.svelte';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';
import { NumberParamStyle, type NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
import type { BooleanParamConfig } from '$lib/base/ParamConfig/BooleanParamConfig';
import type { FunctionParamConfig } from '$lib/base/ParamConfig/FunctionParamConfig';
import { StringParamStyle, type StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';
import {
    NumericArrayParamStyle,
    type NumericArrayParamConfig
} from '$lib/base/ParamConfig/NumericArrayParamConfig';

describe('ParamItem', () => {
    afterEach(cleanup);

    it('creates hover text on label as expected', () => {
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            min: 0,
            max: 10,
            step: 1,
            style: NumberParamStyle.Slider,
            liveUpdates: true,
            hoverText: 'Hover text'
        };

        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param as NumberParamConfig, value: 5, even: false });

        // Check that title is set on the param item
        const labelWrapper = screen.getByTestId('param-label-wrapper');
        expect(labelWrapper.title).toBe('Hover text');
    });
});

describe('ParamItem number styles', () => {
    afterEach(cleanup);

    it('renders a number param (combo style)', () => {
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            min: 0,
            max: 10,
            step: 1,
            style: NumberParamStyle.Combo,
            liveUpdates: true
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param as NumberParamConfig, value: 5, even: false });
        const label = screen.getByText('Number');
        expect(label).toBeDefined();
        const slider = screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        expect(slider.value).toBe('5');
        const field = screen.getAllByTestId('number-param-field')[0] as HTMLInputElement;
        expect(field.value).toBe('5');
    });

    it('renders a number param (slider style)', () => {
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            min: 0,
            max: 10,
            step: 1,
            style: NumberParamStyle.Slider,
            liveUpdates: true
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param as NumberParamConfig, value: 5, even: false });
        const label = screen.getByText('Number');
        expect(label).toBeDefined();
        const slider = screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        expect(slider.value).toBe('5');
        expect(() => {
            screen.getAllByTestId('number-param-field')[0] as HTMLInputElement;
        }).toThrow();
    });

    it('renders a number param (field style)', () => {
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            min: 0,
            max: 10,
            step: 1,
            style: NumberParamStyle.Field,
            liveUpdates: true
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param as NumberParamConfig, value: 5, even: false });
        const label = screen.getByText('Number');
        expect(label).toBeDefined();
        const slider = screen.getAllByTestId('number-param-field')[0] as HTMLInputElement;
        expect(slider.value).toBe('5');
        expect(() => {
            screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        }).toThrow();
    });
});

describe('ParamItem boolean styles', () => {
    afterEach(cleanup);

    it('renders a boolean param', () => {
        const param: BooleanParamConfig = {
            key: 'boolean',
            name: 'Boolean',
            type: ParamType.Boolean,
            liveUpdates: true
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param, value: true, even: false });
        const label = screen.getByText('Boolean');
        expect(label).toBeDefined();
        const checkbox = screen.getAllByTestId('boolean-param-input')[0] as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });
});

describe('ParamItem function styles', () => {
    afterEach(cleanup);

    it('renders a function param', () => {
        const param: FunctionParamConfig = {
            key: 'function',
            name: 'Function',
            type: ParamType.Function,
            liveUpdates: true,
            buttonText: 'Bananas'
        };
        render(ParamItem, {
            config: param,
            // @ts-ignore – value type checking isn't working in the render constructor
            value: () => {
                return;
            },
            even: false
        });
        const label = screen.getByText('Function');
        expect(label).toBeDefined();
        const button = screen.getAllByTestId('function-param-input')[0] as HTMLButtonElement;
        expect(button).toBeDefined();
        const buttonText = screen.getByText('Bananas');
        expect(buttonText).toBeDefined();
    });
});

describe('ParamItem string styles', () => {
    afterEach(cleanup);

    it('renders a string param (singleline style)', () => {
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.SingleLine
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param, value: 'hello', even: false });
        const label = screen.getByText('String');
        expect(label).toBeDefined();
        const field = screen.getAllByTestId('string-param-input-singleline')[0] as HTMLInputElement;
        expect(field.value).toBe('hello');
    });

    it('renders a string param (multiline style)', () => {
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.MultiLine
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param, value: 'hello', even: false });
        const label = screen.getByText('String');
        expect(label).toBeDefined();
        const field = screen.getAllByTestId('string-param-input-multiline')[0] as HTMLInputElement;
        expect(field.value).toBe('hello');
    });

    it('renders a string param (color style)', async () => {
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.Color
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param, value: '#00ff00', even: false });
        const label = screen.getByText('String');
        expect(label).toBeDefined();
        const field = screen.getAllByTestId('color-param-field')[0] as HTMLInputElement;
        expect(field.value).toBe('#00ff00');
        const selector = screen.getAllByTestId('color-param-selector')[0] as HTMLInputElement;
        expect(selector.value).toBe('#00ff00');
    });
});

describe('ParamItem with options', () => {
    afterEach(cleanup);

    it('renders a number param with labeled options', async () => {
        const updateHandler = vi.fn();
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            liveUpdates: true,
            style: NumberParamStyle.Combo,
            options: {
                Three: 3,
                Four: 4,
                Five: 5,
                Six: 6
            },
            min: 0,
            max: 10,
            step: 1
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        const { component } = render(ParamItem, { config: param, value: 5, even: false });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('Five');
        expect(component.value).toBe(5);

        // Check changing the value
        fireEvent.change(field, { target: { value: 'Six' } });
        await waitFor(() => expect(field.value).toBe('Six'));
        expect(component.value).toBe(6);
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a number param with unlabeled options', async () => {
        const updateHandler = vi.fn();
        const param: NumberParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.Number,
            liveUpdates: true,
            style: NumberParamStyle.Combo,
            options: [3, 4, 5, 6],
            min: 0,
            max: 10,
            step: 1
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        const { component } = render(ParamItem, { config: param, value: 5, even: false });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('5');
        expect(component.value).toBe(5);

        // Check changing the value
        fireEvent.change(field, { target: { value: '6' } });
        await waitFor(() => expect(field.value).toBe('6'));
        expect(component.value).toBe(6);
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a string param with labeled options', async () => {
        const updateHandler = vi.fn();
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.SingleLine,
            options: {
                'Hello x2': 'hello hello',
                'World x2': 'world world',
                'Sup x4': 'sup sup sup sup'
            }
        };
        const { component } = render(ParamItem, {
            config: param,
            // @ts-ignore – value type checking isn't working in the render constructor
            value: 'world world',
            even: false
        });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('World x2');
        expect(component.value).toBe('world world');

        // Check changing the value
        fireEvent.change(field, { target: { value: 'Sup x4' } });
        await waitFor(() => expect(field.value).toBe('Sup x4'));
        expect(component.value).toBe('sup sup sup sup');
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a string param with unlabeled options', async () => {
        const updateHandler = vi.fn();
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.SingleLine,
            options: ['hello', 'world', 'sup']
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        const { component } = render(ParamItem, { config: param, value: 'world', even: false });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('world');
        expect(component.value).toBe('world');

        // Check changing the value
        fireEvent.change(field, { target: { value: 'hello' } });
        await waitFor(() => expect(field.value).toBe('hello'));
        expect(component.value).toBe('hello');
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a numeric array param with labeled options', async () => {
        const updateHandler = vi.fn();
        const param: NumericArrayParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.NumericArray,
            liveUpdates: true,
            style: NumericArrayParamStyle.Combo,
            options: [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ],
            min: 0,
            max: 10,
            step: 1
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        const { component } = render(ParamItem, { config: param, value: [4, 5, 6], even: false });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('[4, 5, 6]');
        expect(component.value).toEqual([4, 5, 6]);

        // Check changing the value
        fireEvent.change(field, { target: { value: '[7, 8, 9]' } });
        await waitFor(() => expect(field.value).toBe('[7, 8, 9]'));
        expect(component.value).toEqual([7, 8, 9]);
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a numeric array param with unlabeled options', async () => {
        const updateHandler = vi.fn();
        const param: NumericArrayParamConfig = {
            key: 'number',
            name: 'Number',
            type: ParamType.NumericArray,
            liveUpdates: true,
            style: NumericArrayParamStyle.Combo,
            options: {
                First: [1, 2, 3],
                Second: [4, 5, 6],
                Third: [7, 8, 9]
            },
            min: 0,
            max: 10,
            step: 1
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        const { component } = render(ParamItem, { config: param, value: [4, 5, 6], even: false });
        component.$on('update', updateHandler);

        // Check initial rendering
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
        expect(field.value).toBe('Second');
        expect(component.value).toEqual([4, 5, 6]);

        // Check changing the value
        fireEvent.change(field, { target: { value: 'Third' } });
        await waitFor(() => expect(field.value).toBe('Third'));
        expect(component.value).toEqual([7, 8, 9]);
        expect(updateHandler).toHaveBeenCalledTimes(1);
    });
});
