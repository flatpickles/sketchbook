import { describe, it, expect } from 'vitest';

import {
    ParamConfigFactory,
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ParamConfig';

describe('ParamConfigFactory', () => {
    it('creates ParamConfig objects with the correct type', () => {
        expect(ParamConfigFactory.configFrom(3).type).toEqual('number');
        expect(ParamConfigFactory.configFrom(true).type).toEqual('boolean');
        expect(() => {
            ParamConfigFactory.configFrom('str');
        }).toThrowError('Unsupported param type');
    });

    it('assigns config fields to the param', () => {
        const param = ParamConfigFactory.configFrom(3, { min: 1, max: 5 });
        const numberParam = param as NumberParamConfig;
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('rejects unsupported config fields', () => {
        expect(() => {
            ParamConfigFactory.configFrom(3, { bad: 'field' });
        }).toThrowError('Unsupported param config field: bad');
    });
});
