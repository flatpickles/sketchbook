/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ParamItem from '$lib/components/ParamItem/ParamItem.svelte';
import Project from '$lib/base/Project';
import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
import { ParamType, type ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig/ProjectConfigFactory';
import { NumberParamStyle, type NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
import type { ParamValueType } from '$lib/base/ParamConfig/ParamTypes';
import type { BooleanParamConfig } from '$lib/base/ParamConfig/BooleanParamConfig';
import type { FunctionParamConfig } from '$lib/base/ParamConfig/FunctionParamConfig';
import { StringParamStyle, type StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';

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
            liveUpdates: true
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

    it('renders a string param (options style)', () => {
        const param: StringParamConfig = {
            key: 'string',
            name: 'String',
            type: ParamType.String,
            liveUpdates: true,
            style: StringParamStyle.Options,
            options: ['hello', 'world']
        };
        // @ts-ignore – value type checking isn't working in the render constructor
        render(ParamItem, { config: param, value: 'hello', even: false });
        const label = screen.getByText('String');
        expect(label).toBeDefined();
        const field = screen.getAllByTestId('option-param-input')[0] as HTMLInputElement;
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
