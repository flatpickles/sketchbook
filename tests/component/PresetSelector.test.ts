import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, vi } from 'vitest';
import PresetSelector from '$lib/components/ProjectDetailPanel/PresetSelector.svelte';
import { type PresetMap, defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
import { settingsStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';

const testPresetMap: PresetMap = {
    [defaultPresetKey]: {
        'title': 'Default Values',
        'key': defaultPresetKey,
        'values': {}
    },
    'nicePreset': {
        'title': 'Test Preset',
        'key': 'nicePreset',
        'values': {}
    },
    'swellPreset': {
        'title': 'Swell Preset',
        'key': 'swellPreset',
        'values': {}
    },
    'anotherPreset': {
        'title': 'Another Preset',
        'key': 'anotherPreset',
        'values': {}
    }
};

function renderTestPresets(currentKey = defaultPresetKey): PresetSelector {
    const { component } = render(PresetSelector, {
        presets: testPresetMap,
        currentPresetKey: currentKey
    });
    return component;
}

describe('PresetSelector rendering', () => {
    afterEach(cleanup);

    it('renders presets alphabetically w/ defaults first', async () => {
        renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        const presetOptions = screen.getAllByTestId('preset-option');
        expect(presetOptions.length).toBe(4);
        expect(presetOptions[0].textContent).toContain('Default Values');
        expect(presetOptions[1].textContent).toContain('Another Preset');
        expect(presetOptions[2].textContent).toContain('Swell Preset');
        expect(presetOptions[3].textContent).toContain('Test Preset');
    });

    it('renders with selected preset', async () => {
        renderTestPresets('nicePreset');

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe('nicePreset');
    });

    it('changes selection with currentPresetKey prop', async () => {
        const component = renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);
        component.currentPresetKey = 'nicePreset';
        expect(presetSelect.value).toBe('nicePreset');
    });

    it('renders asterisk with unsaved preset', async () => {
        const component = renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        const presetOptions = screen.getAllByTestId('preset-option');
        expect(presetOptions[0].textContent).toContain('Default Values');
        expect(presetOptions[0].textContent).not.toContain('*');

        component.edited = true;
        expect(presetOptions[0].textContent).toContain('*');

        component.edited = false;
        expect(presetOptions[0].textContent).not.toContain('*');
    });

    it('shows reset action if preset has been edited', async () => {
        const component = renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select');
        expect(presetSelect).toBeDefined();

        const presetOptions = screen.getAllByTestId('preset-option') as HTMLOptionElement[];
        expect(presetOptions[0].textContent).toContain('Default Values');
        expect(presetOptions[0].selected).toBe(true);

        const resetButton = screen.queryByTestId('Reset');
        expect(resetButton).toBeNull();

        component.edited = true;
        const resetButton2 = screen.getByTestId('Reset');
        expect(resetButton2).toBeDefined();

        component.edited = false;
        const resetButton3 = screen.queryByTestId('Reset');
        expect(resetButton3).toBeNull();
    });

    it('disables left button when first preset is selected', async () => {
        const component = renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        const presetOptions = screen.getAllByTestId('preset-option');
        expect(presetOptions[0].textContent).toContain('Default Values');

        const leftButton = screen.getByTestId('previous-preset');
        expect(leftButton).toBeDefined();
        expect(leftButton.classList.contains('disabled')).toBe(true);

        component.currentPresetKey = 'nicePreset';
        expect(leftButton.classList.contains('disabled')).toBe(false);
    });

    it('disables right button when last preset is selected', async () => {
        const component = renderTestPresets();

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();

        component.currentPresetKey = 'nicePreset';
        expect(presetSelect.value).toBe('nicePreset');

        const rightButton = screen.getByTestId('next-preset');
        expect(rightButton).toBeDefined();
        expect(rightButton.classList.contains('disabled')).toBe(true);

        component.currentPresetKey = 'anotherPreset';
        expect(rightButton.classList.contains('disabled')).toBe(false);
    });
});

describe('PresetSelector interactions', () => {
    afterEach(cleanup);

    it('emits preset change event on selection change', async () => {
        const component = renderTestPresets();
        const changeHandler = vi.fn();
        component.$on('preset-selected', changeHandler);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        await fireEvent.change(presetSelect, { target: { value: 'nicePreset' } });
        expect(presetSelect.value).toBe('nicePreset');

        // currentPresetKey is set by containing component, once the change handler is called
        expect(component.currentPresetKey).not.toBe('nicePreset');
        expect(changeHandler).toHaveBeenCalledTimes(1);
        expect(changeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: 'nicePreset'
            })
        );
    });

    it('resets current preset when reset button is clicked', async () => {
        const component = renderTestPresets();
        const changeHandler = vi.fn();
        component.$on('preset-selected', changeHandler);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        component.edited = true;
        const resetOption = screen.getByTestId('Reset') as HTMLOptionElement;
        expect(resetOption).toBeDefined();
        await fireEvent.change(presetSelect, { target: { value: resetOption.value } });

        // resetting is just changing to the current preset key
        expect(changeHandler).toHaveBeenCalledTimes(1);
        expect(changeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: defaultPresetKey
            })
        );

        // Make sure the default is still selected
        expect(presetSelect.value).toBe(defaultPresetKey);
    });

    it('switches to the next preset when the right button is clicked', async () => {
        const component = renderTestPresets();
        const changeHandler = vi.fn();
        component.$on('preset-selected', changeHandler);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe(defaultPresetKey);

        const rightButton = screen.getByTestId('next-preset');
        expect(rightButton).toBeDefined();

        await fireEvent.click(rightButton);

        // currentPresetKey is set by containing component, once the change handler is called
        expect(changeHandler).toHaveBeenCalledTimes(1);
        expect(changeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: 'anotherPreset'
            })
        );
    });

    it('switches to the previous preset when the left button is clicked', async () => {
        const component = renderTestPresets('anotherPreset');
        const changeHandler = vi.fn();
        component.$on('preset-selected', changeHandler);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        expect(presetSelect.value).toBe('anotherPreset');

        const leftButton = screen.getByTestId('previous-preset');
        expect(leftButton).toBeDefined();

        await fireEvent.click(leftButton);

        // currentPresetKey is set by containing component, once the change handler is called
        expect(changeHandler).toHaveBeenCalledTimes(1);
        expect(changeHandler).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: defaultPresetKey
            })
        );
    });

    it('shows export action if enabled', async () => {
        // enable export
        settingsStore.set({
            ...get(settingsStore),
            enablePresetExport: true
        });

        const component = renderTestPresets();
        const exportFn = vi.fn();
        component.$on('export', exportFn);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();

        const exportOption = screen.getByTestId('Export') as HTMLOptionElement;
        expect(exportOption).toBeDefined();
    });

    it('does not show export action if disabled', async () => {
        // disable export
        settingsStore.set({
            ...get(settingsStore),
            enablePresetExport: false
        });

        const component = renderTestPresets();
        const exportFn = vi.fn();
        component.$on('export', exportFn);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();

        const exportOption = screen.queryByTestId('Export') as HTMLOptionElement;
        expect(exportOption).toBeNull();
    });

    it('emits export event when export action is clicked', async () => {
        // enable export
        settingsStore.set({
            ...get(settingsStore),
            enablePresetExport: true
        });

        const component = renderTestPresets();
        const exportFn = vi.fn();
        component.$on('export', exportFn);

        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        const exportOption = screen.getByTestId('Export') as HTMLOptionElement;
        expect(exportOption).toBeDefined();
        await fireEvent.change(presetSelect, { target: { value: exportOption.value } });
        expect(exportFn).toHaveBeenCalledTimes(1);
    });
});
