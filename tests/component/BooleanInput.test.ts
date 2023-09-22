import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach } from 'vitest';
import BooleanInput from '$lib/components/Inputs/BooleanInput.svelte';

describe('BooleanInput', () => {
    afterEach(cleanup);

    it('responds to clicks on checkbox & wrapper', () => {
        const changeHandler = vi.fn();

        const { component } = render(BooleanInput, {
            id: 'boolean-param',
            name: 'Boolean',
            value: true
        });
        expect(component.value).toBe(true);
        component.$on('change', changeHandler);

        // Check rendered elements & values
        const checkbox = screen.getByTestId('boolean-param-input') as HTMLInputElement;
        expect(checkbox).toBeDefined();
        expect(checkbox.checked).toBe(true);
        const wrapper = screen.getByTestId('boolean-param-wrapper');
        expect(wrapper).toBeDefined();

        // Check direct clicks on the checkbox
        fireEvent.click(checkbox);
        expect(component.value).toBe(false);
        expect(changeHandler).toHaveBeenCalledTimes(1);

        // Check clicks on the wrapper
        fireEvent.click(wrapper);
        expect(component.value).toBe(true);
        expect(changeHandler).toHaveBeenCalledTimes(2);
    });
});
