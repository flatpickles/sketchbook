import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Environment from '$app/environment';
import PresetUtil from '$lib/base/ProjectLoading/PresetUtil';
import { cleanup } from '@testing-library/svelte';
import Project from '$lib/base/Project/Project';
import {
    NumberParamStyle,
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import { ParamType } from '$lib/base/ConfigModels/ParamConfig';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import { NumericArrayParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import { FunctionParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/FunctionParamConfig';

class TestProject extends Project {
    testNumberKey = 42;
    testArrayKey = [42, 21, 10.5];
    functionParamKey = () => 42;
}

const testProject = new TestProject();
const projectTuple: ProjectTuple = {
    project: testProject,
    config: ProjectConfigDefaults,
    key: 'testProjectKey',
    params: [
        {
            ...NumberParamConfigDefaults,
            key: 'testNumberKey'
        },
        {
            ...NumericArrayParamConfigDefaults,
            key: 'testArrayKey'
        },
        {
            ...FunctionParamConfigDefaults,
            key: 'functionParamKey'
        }
    ],
    presets: {
        'goodPreset': {
            'title': 'Test Preset',
            'key': 'goodPreset',
            'values': {
                testNumberKey: 21
            }
        },
        'badParamKey': {
            'title': 'Test Preset',
            'key': 'badParamKey',
            'values': {
                notAParam: 12
            }
        },
        'typeofValuesMismatch': {
            'title': 'Test Preset',
            'key': 'typeofValuesMismatch',
            'values': {
                testNumberKey: '43'
            }
        },
        'arrayNonArrayMismatch': {
            'title': 'Test Preset',
            'key': 'arrayNonArrayMismatch',
            'values': {
                testArrayKey: 34
            }
        },
        'arrayComponentsMismatch': {
            'title': 'Test Preset',
            'key': 'arrayComponentsMismatch',
            'values': {
                testNumberKey: [42, 24, 12]
            }
        }
    }
};

describe('PresetUtil', () => {
    beforeEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('sets selected preset key in local storage', () => {
        PresetUtil.setSelectedPresetKey('testProjectKey', 'testPresetKey');
        expect(localStorage.getItem('selectedPreset_testProjectKey')).toBe('testPresetKey');
    });

    it('gets selected preset key from local storage', () => {
        localStorage.setItem('selectedPreset_testProjectKey', 'testPresetKey');
        const presetKey = PresetUtil.getSelectedPresetKey('testProjectKey');
        expect(presetKey).toBe('testPresetKey');
    });

    it('returns default preset key if no preset is selected', () => {
        const presetKey = PresetUtil.getSelectedPresetKey('testProjectKey');
        expect(presetKey).toBe(defaultPresetKey);
    });
});

describe('Preset application via PresetUtil.applyPreset', () => {
    it("applies a preset to a project's values", () => {
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        expect(testProject.testNumberKey).toBe(21);
    });

    it('calls ParamvalueProvider.setValue for each param', () => {
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        expect(localStorage.getItem('testProjectKey_testNumberKey')).toBe('21');
    });

    it('calls the callback if provided', () => {
        const callback = vi.fn();
        PresetUtil.applyPreset(projectTuple, 'goodPreset', callback);
        expect(callback).toHaveBeenCalledWith('testNumberKey', 21);
    });

    it('throws an error if the preset is not found', () => {
        expect(() => PresetUtil.applyPreset(projectTuple, 'ghostPreset')).toThrowError(
            'Preset ghostPreset not found'
        );
    });

    it('throws an error if the param is not found', () => {
        expect(() => PresetUtil.applyPreset(projectTuple, 'badParamKey')).toThrowError(
            'Param notAParam not found'
        );
    });

    it('throws an error if the preset value type does not match the current value type', () => {
        expect(() => PresetUtil.applyPreset(projectTuple, 'typeofValuesMismatch')).toThrowError(
            'Preset value type mismatch for param testNumberKey: string vs number'
        );
    });

    it('throws an error if a non-array value is assigned to an array', () => {
        // todo
    });

    it('throws an error if assigned array length does not match', () => {
        // todo
    });

    it('throws an error if assigned array component types do not match', () => {
        // todo
    });
});

// describe('Checking if presets are applied via PresetUtil.presetIsApplied', () => {
//     // todo
// });
