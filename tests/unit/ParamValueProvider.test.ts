import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Environment from '$app/environment';
import ParamValueProvider from '$lib/base/Util/ParamValueProvider';
import { cleanup } from '@testing-library/svelte';
import Project from '$lib/base/Project/Project';
import type { NumberParamConfig } from '$lib/base/ParamConfig/NumberParamConfig';

class TestProject extends Project {
    testParamKey = 42;
}

const numberParamConfig = {
    type: 'number',
    key: 'testParamKey',
    name: 'Untitled Param',
    applyDuringInput: false,
    fullWidthInput: false,
    min: 0,
    max: 50,
    step: 0.01,
    style: 'combo',
    options: undefined
} as NumberParamConfig;

describe('ParamValueProvider', () => {
    beforeEach(() => {
        cleanup();
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('sets localStorage value in browser mode', () => {
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        expect(Environment.browser).toBe(true);
        ParamValueProvider.setValue(numberParamConfig, 'testProjectKey', 12);
        expect(localStorage.setItem).toHaveBeenCalledWith('testProjectKey_testParamKey', '12');
    });

    it('does not set localStorage value in non-browser mode', () => {
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(false);
        expect(Environment.browser).toBe(false);
        ParamValueProvider.setValue(numberParamConfig, 'testProjectKey', 12);
        expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it('gets localStorage value in browser mode', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('32');
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        expect(Environment.browser).toBe(true);
        const value = ParamValueProvider.getValue(
            numberParamConfig,
            'testProjectKey',
            new TestProject()
        );
        expect(value).toBe(32);
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey_testParamKey');
    });

    it('gets project value in non-browser mode', () => {
        vi.spyOn(Storage.prototype, 'getItem');
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(false);
        expect(Environment.browser).toBe(false);
        const value = ParamValueProvider.getValue(
            numberParamConfig,
            'testProjectKey',
            new TestProject()
        );
        expect(value).toBe(42);
        expect(localStorage.getItem).not.toHaveBeenCalled();
    });

    it('gets project value in browser mode when localStorage value is undefined', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        expect(Environment.browser).toBe(true);
        const value = ParamValueProvider.getValue(
            numberParamConfig,
            'testProjectKey',
            new TestProject()
        );
        expect(value).toBe(42);
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey_testParamKey');
    });

    it("initialLoad: uses stored value when file value hasn't changed", () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
            if (key === 'testProjectKey_testParamKey') return '32';
            else if (key === 'lastInitialValue_testProjectKey_testParamKey') return '42';
            else return null;
        });
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        expect(Environment.browser).toBe(true);

        const project = new TestProject();
        const value = ParamValueProvider.getValue(
            numberParamConfig,
            'testProjectKey',
            project,
            true
        );
        expect(value).toBe(32);
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey_testParamKey');
        expect(localStorage.getItem).toHaveBeenCalledWith(
            'lastInitialValue_testProjectKey_testParamKey'
        );
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(project.testParamKey).toBe(42);
    });

    it('initialLoad: uses file value instead of stored value when file value has changed', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
            if (key === 'testProjectKey_testParamKey') return '22';
            else if (key === 'lastInitialValue_testProjectKey_testParamKey') return '32';
            else return null;
        });
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
        expect(Environment.browser).toBe(true);

        const project = new TestProject();
        const value = ParamValueProvider.getValue(
            numberParamConfig,
            'testProjectKey',
            project,
            true
        );
        expect(value).toBe(42);
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey_testParamKey');
        expect(localStorage.getItem).toHaveBeenCalledWith(
            'lastInitialValue_testProjectKey_testParamKey'
        );
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(project.testParamKey).toBe(42);
    });
});
