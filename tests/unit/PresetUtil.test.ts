import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Environment from '$app/environment';
import PresetUtil from '$lib/base/ProjectLoading/PresetUtil';
import { cleanup } from '@testing-library/svelte';
import Project from '$lib/base/Project/Project';
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { defaultPresetKey } from '$lib/base/ProjectLoading/PresetLoader';
import type { ProjectTuple } from '$lib/base/ProjectLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import {
    NumericArrayParamConfigDefaults,
    NumericArrayParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import { FunctionParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/FunctionParamConfig';

class TestProject extends Project {
    testNumberKey = 42;
    testArrayKey = [42, 21, 10.5];
    functionParamKey = () => 42;
    colorArrayUnit = [0.5, 0.5, 0.5];
    colorArrayByte = [100, 100, 100];
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
        },
        {
            ...NumericArrayParamConfigDefaults,
            key: 'colorArrayUnit',
            style: NumericArrayParamStyle.UnitColor
        },
        {
            ...NumericArrayParamConfigDefaults,
            key: 'colorArrayByte',
            style: NumericArrayParamStyle.ByteColor
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
                notAParam: 12,
                testNumberKey: 42,
                testArrayKey: [10.5, 21, 42]
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
        },
        'arrayColorsWithHex': {
            'title': 'Test Preset',
            'key': 'arrayColorsWithHex',
            'values': {
                colorArrayUnit: '#ffffff',
                colorArrayByte: '#ffffff'
            }
        },
        'badColor': {
            'title': 'Test Preset',
            'key': 'badColors',
            'values': {
                testArrayKey: '#ffffff'
            }
        }
    }
};

function consoleErrorMock() {
    import.meta.env.MODE = 'production'; // for this test only
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    const mockConsoleError = vi.fn((error: string) => {});
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
}

function checkConsoleErrorMock(error: string) {
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(error);
    import.meta.env.MODE = 'test'; // set it back
    vi.spyOn(console, 'error').mockRestore();
}

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
        testProject.colorArrayUnit = [0.5, 0.5, 0.5];
        testProject.colorArrayByte = [100, 100, 100];
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

    it('logs an error if the param is not found, and still calls callback', () => {
        const callback = vi.fn();
        consoleErrorMock();
        PresetUtil.applyPreset(projectTuple, 'badParamKey', callback);
        checkConsoleErrorMock(
            'Error applying preset badParamKey. Error: Param notAParam not found'
        );
        expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining(['badParamKey']),
            expect.objectContaining({
                testNumberKey: 42,
                testArrayKey: [10.5, 21, 42]
            })
        );
    });

    it('logs an error if the preset value type does not match the current value type', () => {
        consoleErrorMock();
        PresetUtil.applyPreset(projectTuple, 'typeofValuesMismatch');
        checkConsoleErrorMock(
            'Error applying preset typeofValuesMismatch. Error: Preset value type mismatch for param testNumberKey: string vs number'
        );
    });

    it('logs an error if assigned array length does not match', () => {
        consoleErrorMock();
        PresetUtil.applyPreset(projectTuple, 'arrayLengthMismatch');
        checkConsoleErrorMock(
            'Error applying preset arrayLengthMismatch. Error: Preset value type mismatch for param testArrayKey: array lengths 2 vs 3'
        );
    });

    it('assigns color strings as numeric arrays with color style', () => {
        const completion = vi.fn();
        PresetUtil.applyPreset(projectTuple, 'arrayColorsWithHex', completion);
        expect(testProject.colorArrayUnit).toEqual([1, 1, 1]);
        expect(testProject.colorArrayByte).toEqual([255, 255, 255]);
        expect(completion).toHaveBeenCalledWith(
            expect.arrayContaining(['colorArrayUnit', 'colorArrayByte']),
            expect.objectContaining({
                colorArrayUnit: [1, 1, 1],
                colorArrayByte: [255, 255, 255]
            })
        );
    });

    it('logs an error if a color string is assigned to a non-color array', () => {
        consoleErrorMock();
        PresetUtil.applyPreset(projectTuple, 'badColor');
        checkConsoleErrorMock(
            'Error applying preset badColor. Error: Preset value type mismatch for param testArrayKey: hex strings can only be assigned for numeric arrays with color style.'
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
        testProject.colorArrayUnit = [0.5, 0.5, 0.5];
        testProject.colorArrayByte = [100, 100, 100];
    });

    it('returns true if preset has been applied', () => {
        PresetUtil.applyPreset(projectTuple, 'goodPreset');
        const isApplied = PresetUtil.presetIsApplied(projectTuple, 'goodPreset');
        expect(isApplied).toBe(true);
    });

    it('returns true if hex color preset has been applied', () => {
        PresetUtil.applyPreset(projectTuple, 'arrayColorsWithHex');
        const isApplied = PresetUtil.presetIsApplied(projectTuple, 'arrayColorsWithHex');
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

    it('returns false if hex color preset has been applied then modified, true if changed back', () => {
        PresetUtil.applyPreset(projectTuple, 'arrayColorsWithHex');
        testProject.colorArrayUnit[1] = 0.3;
        const isApplied = PresetUtil.presetIsApplied(projectTuple, 'arrayColorsWithHex');
        expect(isApplied).toBe(false);
        testProject.colorArrayUnit[1] = 1.0;
        const isApplied2 = PresetUtil.presetIsApplied(projectTuple, 'arrayColorsWithHex');
        expect(isApplied2).toBe(true);
    });

    it('throws an error if the preset is not found', () => {
        expect(() => PresetUtil.presetIsApplied(projectTuple, 'ghostPreset')).toThrowError(
            'Preset ghostPreset not found'
        );
    });
});

describe('Preset export via PresetUtil.exportPresetFile', () => {
    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
        testProject.testNumberKey = 42;
        testProject.testArrayKey = [42, 21, 10.5];
        testProject.colorArrayUnit = [0.5, 0.5, 0.5];
        testProject.colorArrayByte = [100, 100, 100];
    });

    it('should create a preset file', () => {
        // Mock some stuff
        global.JSON.stringify = vi.fn(() => 'testJSON');
        global.URL.createObjectURL = vi.fn();
        const mockLink = {
            href: 'unset',
            download: 'unset',
            click: vi.fn()
        };
        global.document.createElement = vi.fn(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return mockLink as any;
        });

        // Set values and export the file
        testProject.testNumberKey = 85;
        testProject.testArrayKey = [18, 19, 21];
        PresetUtil.exportPresetFile(projectTuple, 'Test Preset');

        // Check the JSON & URL creation and click
        expect(global.JSON.stringify).toHaveBeenCalledWith(
            {
                title: 'Test Preset',
                values: {
                    testNumberKey: 85,
                    testArrayKey: [18, 19, 21],
                    colorArrayUnit: [0.5, 0.5, 0.5],
                    colorArrayByte: [100, 100, 100]
                }
            },
            null,
            4
        );
        expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
        expect(global.document.createElement).toHaveBeenCalledWith('a');
        expect(mockLink.href).not.toBe('unset');
        expect(mockLink.download).toBe('TestPreset.json');
        expect(mockLink.click).toHaveBeenCalled();
    });
});
