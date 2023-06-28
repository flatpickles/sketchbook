import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import { ParamConfig, NumberParamConfig, BooleanParamConfig } from '$lib/base/ParamConfig';

describe('ParamConfig.from', () => {
    it('creates ParamConfig objects with the correct subclass', () => {
        expect(ParamConfig.from(3)).toBeInstanceOf(NumberParamConfig);
        expect(ParamConfig.from(true)).toBeInstanceOf(BooleanParamConfig);
        expect(() => {
            ParamConfig.from('str');
        }).toThrowError('Unsupported param type');
    });

    it('assigns config fields to the param', () => {
        const numberParamWithDefaults = new NumberParamConfig();
        const param = ParamConfig.from(3, { min: 1, max: 5 });
        const numberParam = param as NumberParamConfig;
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);
        expect(numberParam.step).toEqual(numberParamWithDefaults.step);
        expect(numberParam.liveUpdates).toEqual(numberParamWithDefaults.liveUpdates);
        expect(numberParam.style).toEqual(numberParamWithDefaults.style);
    });

    it('rejects unsupported config fields', () => {
        expect(() => {
            ParamConfig.from(3, { bad: 'field' });
        }).toThrowError('Unsupported param config field: bad');
    });
});
