import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ParamItem from '$lib/components/ParamItem/ParamItem.svelte';
import Project from '$lib/base/Project';
import type { ProjectTuple } from '$lib/base/FileLoading/ProjectLoader';
import { ParamType, type ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig/ProjectConfigFactory';
import { NumberParamStyle, type NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';
import type { ParamValueType } from '$lib/base/ParamConfig/ParamTypes';

import NumberInput from '$lib/components/ParamItem/NumberInput.svelte';

describe('NumberInput', () => {
    it('renders a field and a slider', async () => {
        render(NumberInput, {
            name: 'Number',
            min: 0,
            max: 10,
            step: 1,
            value: 5,

            showSlider: true,
            showField: true
        });

        // Check rendered elements & values
        const slider = screen.getByTestId('number-param-slider') as HTMLInputElement;
        expect(slider).toBeDefined();
        expect(slider.value).toBe('5');
        expect(slider.min).toBe('0');
        expect(slider.max).toBe('10');
        expect(slider.step).toBe('1');
        const field = screen.getByTestId('number-param-field') as HTMLInputElement;
        expect(field).toBeDefined();
        expect(field.value).toBe('5');
        expect(field.min).toBe('0');
        expect(field.max).toBe('10');
        expect(field.step).toBe('1');

        // Check that the slider and field are linked
        fireEvent.input(slider, { target: { value: '7' } });
        await waitFor(() => expect(field.value).toBe('7'));
        fireEvent.input(field, { target: { value: '3' } });
        await waitFor(() => expect(slider.value).toBe('3'));

        // todo: change not working
    });
});
