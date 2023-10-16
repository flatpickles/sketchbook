import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import { config } from '$config/settings';

import ProjectDetailPanel from '$lib/components/ProjectDetailPanel/ProjectDetailPanel.svelte';
import Project from '$lib/base/Project/Project';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
import PresetUtil from '$lib/base/ProjectLoading/PresetUtil';
import { settingsStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';

class TestProject extends Project {
    num1 = 0;
    num2 = 0;
    num3 = 0;
}

const defaultPresets = {
    [defaultPresetKey]: {
        title: 'Default Values',
        key: defaultPresetKey,
        values: {
            num1: 0,
            num2: 0,
            num3: 0
        }
    }
};

const testProjectTuple: ProjectTuple = {
    key: 'testProject',
    project: new TestProject(),
    config: ProjectConfigDefaults,
    params: [
        {
            ...NumberParamConfigDefaults,
            key: 'num1'
        },
        {
            ...NumberParamConfigDefaults,
            key: 'num2'
        },
        {
            ...NumberParamConfigDefaults,
            key: 'num3'
        }
    ],
    presets: {
        ...defaultPresets,
        testPreset1: {
            title: 'Test Preset 1',
            key: 'testPreset1',
            values: {
                num1: 1,
                num2: 2,
                num3: 3
            }
        },
        testPreset2: {
            title: 'Test Preset 2',
            key: 'testPreset2',
            values: {
                num1: 4,
                num2: 5,
                num3: 6
            }
        }
    }
};

describe('ProjectDetailPanel', () => {
    afterEach(() => {
        cleanup();
    });

    it("doesn't show the Presets UI when there are no presets", () => {
        vi.spyOn(config, 'alwaysShowPresets', 'get').mockReturnValue(false);

        render(ProjectDetailPanel, {
            projectTuple: {
                ...testProjectTuple,
                presets: defaultPresets
            },
            headerButtonIcon: undefined
        });

        const presetsUI = screen.queryByTestId('presets-ui');
        expect(presetsUI).toBeNull();
    });

    it('shows the Presets UI when there are no presets, but alwaysShowPresets=true', () => {
        vi.spyOn(config, 'alwaysShowPresets', 'get').mockReturnValue(true);

        render(ProjectDetailPanel, {
            projectTuple: {
                ...testProjectTuple,
                presets: defaultPresets
            },
            headerButtonIcon: undefined
        });

        const presetsUI = screen.queryByTestId('presets-ui');
        expect(presetsUI).not.toBeNull();
    });

    it('shows the Presets UI when there are presets', () => {
        vi.spyOn(config, 'alwaysShowPresets', 'get').mockReturnValue(false);

        render(ProjectDetailPanel, {
            projectTuple: testProjectTuple,
            headerButtonIcon: undefined
        });

        const presetsUI = screen.queryByTestId('presets-ui');
        expect(presetsUI).not.toBeNull();
    });

    it('sets selected preset key when a preset is selected', async () => {
        vi.spyOn(PresetUtil, 'setSelectedPresetKey');
        render(ProjectDetailPanel, {
            projectTuple: testProjectTuple,
            headerButtonIcon: undefined
        });
        expect(PresetUtil.setSelectedPresetKey).toHaveBeenCalledTimes(0);

        // Get next button
        const nextButton = screen.getByTestId('next-preset');
        expect(nextButton).toBeDefined();
        expect(nextButton.classList.contains('disabled')).toBe(false);

        // Click next button
        fireEvent.click(nextButton);
        expect(PresetUtil.setSelectedPresetKey).toHaveBeenCalledTimes(1);
    });

    it('gets selected preset key when the project loads and changes', async () => {
        vi.spyOn(PresetUtil, 'getSelectedPresetKey');
        const { component } = render(ProjectDetailPanel, {
            projectTuple: testProjectTuple,
            headerButtonIcon: undefined
        });
        expect(PresetUtil.getSelectedPresetKey).toHaveBeenCalledTimes(1);

        // Change project
        const newProjectTuple = {
            ...testProjectTuple,
            key: 'newProjectKey'
        };
        component.projectTuple = newProjectTuple;
        expect(PresetUtil.getSelectedPresetKey).toHaveBeenCalledTimes(2);
    });

    it('prompts the user to name a new preset when export is triggered', async () => {
        settingsStore.set({
            ...get(settingsStore),
            enablePresetExport: true
        });

        // Render component
        vi.spyOn(PresetUtil, 'exportPresetFile').mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (projectTuple: ProjectTuple, newPresetName: string) => {
                // no-op
            }
        );
        render(ProjectDetailPanel, {
            projectTuple: testProjectTuple,
            headerButtonIcon: undefined
        });
        expect(PresetUtil.exportPresetFile).toHaveBeenCalledTimes(0);

        // Mock window.prompt
        const promptFn = vi.fn(() => 'New Preset');
        vi.spyOn(window, 'prompt').mockImplementation(promptFn);

        // Get selector
        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        await fireEvent.change(presetSelect, { target: { value: 'Export Action' } });

        // Check results
        expect(promptFn).toHaveBeenCalledTimes(1);
        expect(PresetUtil.exportPresetFile).toHaveBeenCalledTimes(1);
        expect(PresetUtil.exportPresetFile).toHaveBeenCalledWith(testProjectTuple, 'New Preset');
    });

    it("doesn't trigger export with empty prompt response", async () => {
        settingsStore.set({
            ...get(settingsStore),
            enablePresetExport: true
        });

        // Render component
        vi.spyOn(PresetUtil, 'exportPresetFile');
        render(ProjectDetailPanel, {
            projectTuple: testProjectTuple,
            headerButtonIcon: undefined
        });

        // Mock window.prompt
        const promptFn = vi.fn(() => '  ');
        vi.spyOn(window, 'prompt').mockImplementation(promptFn);

        // Get selector
        const presetSelect = screen.getByTestId('preset-select') as HTMLSelectElement;
        expect(presetSelect).toBeDefined();
        await fireEvent.change(presetSelect, { target: { value: 'Export Action' } });

        // Check results
        expect(promptFn).toHaveBeenCalledTimes(1);
        expect(PresetUtil.exportPresetFile).toHaveBeenCalledTimes(0);
    });
});
