import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { config } from '$config/settings';

import ProjectDetailPanel from '$lib/components/ProjectDetailPanel/ProjectDetailPanel.svelte';
import Project from '$lib/base/Project/Project';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';

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
});

// todo: test the rest of the ProjectDetailPanel component (not param controls, tested elsewhere)
