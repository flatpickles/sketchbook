import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import NumberInput from '$lib/components/Inputs/NumberInput.svelte';

describe('NumberInput', () => {
    afterEach(cleanup);

    it('renders a field and a slider', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(NumberInput, {
            id: 'number-param',
            name: 'Number',
            min: 0,
            max: 10,
            step: 1,
            value: 5,

            showSlider: true,
            showField: true
        });
        expect(component.value).toBe(5);
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

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
        expect(component.value).toBe(7);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.input(field, { target: { value: '3' } });
        await waitFor(() => expect(slider.value).toBe('3'));
        expect(component.value).toBe(3);
        expect(inputHandler).toHaveBeenCalledTimes(2);
        fireEvent.change(field);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check field validation (changing to an empty string)
        fireEvent.input(field, { target: { value: '' } });
        await waitFor(() => expect(field.value).toBe(''));
        expect(slider.value).toBe('3');
        expect(component.value).toBe(3);
        fireEvent.change(field);
        await waitFor(() => expect(field.value).toBe('3'));
        expect(slider.value).toBe('3');
        expect(component.value).toBe(3);
        expect(inputHandler).toHaveBeenCalledTimes(2);
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a field', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(NumberInput, {
            id: 'number-param',
            name: 'Number',
            min: 0,
            max: 10,
            step: 1,
            value: 5,

            showSlider: false,
            showField: true
        });
        expect(component.value).toBe(5);
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        expect(() => {
            screen.getByTestId('number-param-slider') as HTMLInputElement;
        }).toThrow();
        const field = screen.getByTestId('number-param-field') as HTMLInputElement;
        expect(field).toBeDefined();
        expect(field.value).toBe('5');
        expect(field.min).toBe('0');
        expect(field.max).toBe('10');
        expect(field.step).toBe('1');

        // Check that the field events fire as expected
        fireEvent.input(field, { target: { value: '7' } });
        await waitFor(() => expect(field.value).toBe('7'));
        expect(component.value).toBe(7);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.change(field);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check field validation (changing to an empty string)
        fireEvent.input(field, { target: { value: '' } });
        await waitFor(() => expect(field.value).toBe(''));
        expect(component.value).toBe(7);
        fireEvent.change(field);
        await waitFor(() => expect(field.value).toBe('7'));
        expect(component.value).toBe(7);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a slider', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(NumberInput, {
            id: 'number-param',
            name: 'Number',
            min: 0,
            max: 10,
            step: 1,
            value: 5,

            showSlider: true,
            showField: false
        });
        expect(component.value).toBe(5);
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        const slider = screen.getByTestId('number-param-slider') as HTMLInputElement;
        expect(slider).toBeDefined();
        expect(slider.value).toBe('5');
        expect(slider.min).toBe('0');
        expect(slider.max).toBe('10');
        expect(slider.step).toBe('1');
        expect(() => {
            screen.getByTestId('number-param-field') as HTMLInputElement;
        }).toThrow();

        // Check that the slider events fire as expected
        fireEvent.input(slider, { target: { value: '7' } });
        await waitFor(() => expect(slider.value).toBe('7'));
        expect(component.value).toBe(7);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.change(slider);
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });
});
