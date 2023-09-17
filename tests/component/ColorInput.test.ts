import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ColorInput from '$lib/components/Inputs/ColorInput.svelte';

describe('ColorInput', () => {
    afterEach(cleanup);

    it('renders a field and a color picker (hex string value)', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(ColorInput, {
            name: 'Color',
            value: '#ff0000'
        });
        expect(component.value).toBe('#ff0000');
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        const picker = screen.getByTestId('color-param-selector') as HTMLInputElement;
        expect(picker).toBeDefined();
        expect(picker.value).toBe('#ff0000');
        const field = screen.getByTestId('color-param-field') as HTMLInputElement;
        expect(field).toBeDefined();
        expect(field.value).toBe('#ff0000');

        // Check that the picker and field are linked
        fireEvent.input(picker, { target: { value: '#00ff00' } });
        await waitFor(() => expect(field.value).toBe('#00ff00'));
        expect(component.value).toBe('#00ff00');
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.input(field, { target: { value: '#0000ff' } });
        await waitFor(() => expect(picker.value).toBe('#0000ff'));
        expect(component.value).toBe('#0000ff');
        expect(inputHandler).toHaveBeenCalledTimes(2);
        fireEvent.change(field);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check field validation (changing to an invalid string)
        fireEvent.input(field, { target: { value: '#0000f' } });
        await waitFor(() => expect(field.value).toBe('#0000f'));
        expect(picker.value).toBe('#0000ff');
        expect(component.value).toBe('#0000ff');
        fireEvent.change(field);
        await waitFor(() => expect(field.value).toBe('#0000ff'));
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a field and a color picker (numeric array value, non-unit colors)', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(ColorInput, {
            name: 'Color',
            value: [255, 0, 0],
            unitColorArrays: false
        });
        expect(component.value).toEqual([255, 0, 0]);
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        const picker = screen.getByTestId('color-param-selector') as HTMLInputElement;
        expect(picker).toBeDefined();
        expect(picker.value).toBe('#ff0000');
        const field = screen.getByTestId('color-param-field') as HTMLInputElement;
        expect(field).toBeDefined();
        expect(field.value).toBe('#ff0000');

        // Check that the picker and field are linked
        fireEvent.input(picker, { target: { value: '#00ff00' } });
        await waitFor(() => expect(field.value).toBe('#00ff00'));
        expect(component.value).toEqual([0, 255, 0]);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.input(field, { target: { value: '#0000ff' } });
        await waitFor(() => expect(picker.value).toBe('#0000ff'));
        expect(component.value).toEqual([0, 0, 255]);
        expect(inputHandler).toHaveBeenCalledTimes(2);
        fireEvent.change(field);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check field validation (changing to an invalid string)
        fireEvent.input(field, { target: { value: '#0000f' } });
        await waitFor(() => expect(field.value).toBe('#0000f'));
        expect(picker.value).toBe('#0000ff');
        expect(component.value).toEqual([0, 0, 255]);
        fireEvent.change(field);
        await waitFor(() => expect(field.value).toBe('#0000ff'));
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('renders a field and a color picker (numeric array value, unit colors)', async () => {
        // Dummy functions for event monitoring
        const inputHandler = vi.fn();
        const changeHandler = vi.fn();

        // Render the component
        const { component } = render(ColorInput, {
            name: 'Color',
            value: [1, 0, 0],
            unitColorArrays: true
        });
        expect(component.value).toEqual([1, 0, 0]);
        component.$on('input', inputHandler);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        const picker = screen.getByTestId('color-param-selector') as HTMLInputElement;
        expect(picker).toBeDefined();
        expect(picker.value).toBe('#ff0000');
        const field = screen.getByTestId('color-param-field') as HTMLInputElement;
        expect(field).toBeDefined();
        expect(field.value).toBe('#ff0000');

        // Check that the picker and field are linked
        fireEvent.input(picker, { target: { value: '#00ff00' } });
        await waitFor(() => expect(field.value).toBe('#00ff00'));
        expect(component.value).toEqual([0, 1, 0]);
        expect(inputHandler).toHaveBeenCalledTimes(1);
        fireEvent.input(field, { target: { value: '#0000ff' } });
        await waitFor(() => expect(picker.value).toBe('#0000ff'));
        expect(component.value).toEqual([0, 0, 1]);
        expect(inputHandler).toHaveBeenCalledTimes(2);
        fireEvent.change(field);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check field validation (changing to an invalid string)
        fireEvent.input(field, { target: { value: '#0000f' } });
        await waitFor(() => expect(field.value).toBe('#0000f'));
        expect(picker.value).toBe('#0000ff');
        expect(component.value).toEqual([0, 0, 1]);
        fireEvent.change(field);
        await waitFor(() => expect(field.value).toBe('#0000ff'));
        expect(changeHandler).toHaveBeenCalledTimes(1);
    });
});
