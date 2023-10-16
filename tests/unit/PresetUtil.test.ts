import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Environment from '$app/environment';
import PresetUtil from '$lib/base/ProjectLoading/PresetUtil';
import { cleanup } from '@testing-library/svelte';
import Project from '$lib/base/Project/Project';
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
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
        [defaultPresetKey]: {
            'title': 'Default Values',
            'key': defaultPresetKey,
            'values': {
                testNumberKey: 42,
                testArrayKey: [42, 21, 10.5]
            }
        },
        'goodPreset': {
            'title': 'Test Preset',
            'key': 'goodPreset',
            'values': {
                testNumberKey: 21,
                testArrayKey: [10.5, 21, 42]
            }
        },
        'goodPreset2': {
            'title': 'Test Preset',
            'key': 'goodPreset2',
            'values': {
                testNumberKey: 42,
                testArrayKey: [10.5, 21, 42]
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
        'arrayLengthMismatch': {
            'title': 'Test Preset',
            'key': 'arrayLengthMismatch',
            'values': {
                testArrayKey: [42, 84]
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
    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
        testProject.testNumberKey = 42;
        testProject.testArrayKey = [42, 21, 10.5];
    });

    it("applies a preset to a project's values", () => {
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        expect(testProject.testNumberKey).toBe(21);
    });

    it('calls ParamValueProvider.setValue for each non-valued param', () => {
        const browserCheckFn = vi.fn(() => true);
        vi.spyOn(Environment, 'browser', 'get').mockImplementation(browserCheckFn);
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        expect(localStorage.getItem('testProjectKey_testNumberKey')).toBe('21');
        expect(browserCheckFn).toHaveBeenCalledTimes(2);
    });

    it('calls the callback if provided', () => {
        const callback = vi.fn();
        PresetUtil.applyPreset(projectTuple, 'goodPreset', callback);
        expect(callback).toHaveBeenCalledWith(
            expect.arrayContaining(['testNumberKey', 'testArrayKey']),
            expect.objectContaining({
                testNumberKey: 21,
                testArrayKey: [10.5, 21, 42]
            })
        );
    });

    it("doesn't indicate changes for unchanged values", () => {
        const callback = vi.fn();
        PresetUtil.applyPreset(projectTuple, 'goodPreset2', callback);
        expect(callback).toHaveBeenCalledWith(
            expect.not.arrayContaining(['testNumberKey']),
            expect.objectContaining({
                testNumberKey: 42,
                testArrayKey: [10.5, 21, 42]
            })
        );
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

    it('throws an error if assigned array length does not match', () => {
        expect(() => PresetUtil.applyPreset(projectTuple, 'arrayLengthMismatch')).toThrowError(
            'Preset value type mismatch for param testArrayKey: array lengths 2 vs 3'
        );
    });
});

describe('Checking if presets are applied via PresetUtil.presetIsApplied', () => {
    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
        testProject.testNumberKey = 42;
        testProject.testArrayKey = [42, 21, 10.5];
    });

    it('returns true if preset has been applied', () => {
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        const isApplied = PresetUtil.presetIsApplied(projectTuple, 'goodPreset');
        expect(isApplied).toBe(true);
    });

    it('returns true if default is applied', () => {
        const isApplied = PresetUtil.presetIsApplied(projectTuple, defaultPresetKey);
        expect(isApplied).toBe(true);
    });

    it('returns true if values are assigned directly', () => {
        testProject.testNumberKey = 21;
        expect(PresetUtil.presetIsApplied(projectTuple, 'goodPreset')).toBe(false);
        testProject.testArrayKey = [10.5, 21, 42];
        expect(PresetUtil.presetIsApplied(projectTuple, 'goodPreset')).toBe(true);
        testProject.testArrayKey[1] = 42;
        expect(PresetUtil.presetIsApplied(projectTuple, 'goodPreset')).toBe(false);
    });

    it('returns false if preset is not applied', () => {
        const isApplied = PresetUtil.presetIsApplied(projectTuple, 'goodPreset');
        expect(isApplied).toBe(false);
    });

    it('throws an error if the preset is not found', () => {
        expect(() => PresetUtil.presetIsApplied(projectTuple, 'ghostPreset')).toThrowError(
            'Preset ghostPreset not found'
        );
    });
});
