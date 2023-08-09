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

describe('ParamItem', () => {
    afterEach(cleanup);

    it('renders a number param (combo style)', async () => {
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

        // Check rendered elements & values
        const label = screen.getByText('Number');
        expect(label).toBeDefined();
        const slider = screen.getAllByTestId('number-param-slider')[0] as HTMLInputElement;
        expect(slider.value).toBe('5');
        expect(slider.min).toBe('0');
        expect(slider.max).toBe('10');
        expect(slider.step).toBe('1');
        const field = screen.getAllByTestId('number-param-field')[0] as HTMLInputElement;
        expect(field.value).toBe('5');
        expect(field.min).toBe('0');
        expect(field.max).toBe('10');
        expect(field.step).toBe('1');

        // Check that the slider and field are linked
        fireEvent.input(slider, { target: { value: '7' } });
        await waitFor(() => expect(field.value).toBe('7'));
        fireEvent.input(field, { target: { value: '3' } });
        await waitFor(() => expect(slider.value).toBe('3'));

        // todo: not working with change event?
    });
});
