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
    liveUpdates: false,
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
        expect(localStorage.setItem).toHaveBeenCalledWith('testProjectKey - testParamKey', '12');
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
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey - testParamKey');
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
        expect(localStorage.getItem).toHaveBeenCalledWith('testProjectKey - testParamKey');
    });
});
