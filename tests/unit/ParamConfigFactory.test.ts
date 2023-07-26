import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ParamConfig/NumberParamConfig';
import { ParamConfigFactory } from '$lib/base/ParamConfig/ParamConfigFactory';
import { describe, it, expect } from 'vitest';

describe('ParamConfigFactory', () => {
    it('creates ParamConfig objects with the correct type', () => {
        expect(ParamConfigFactory.configFrom(3, 'number').type).toEqual('number');
        expect(ParamConfigFactory.configFrom(true, 'bool').type).toEqual('boolean');
        // expect(() => {
        //     ParamConfigFactory.configFrom('str', 'string');
        // }).toThrow();
    });

    it('assigns config fields to the param', () => {
        const param = ParamConfigFactory.configFrom(3, 'Unused', { name: 'Name', min: 1, max: 5 });
        const numberParam = param as NumberParamConfig;
        expect(numberParam.name).toEqual('Name');
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('rejects unsupported config fields', () => {
        expect(() => {
            ParamConfigFactory.configFrom(3, 'param', { bad: 'field' });
        }).toThrow();
    });

    it('assigns default names properly without config', () => {
        const param1 = ParamConfigFactory.configFrom(3, 'number');
        expect(param1.name).toEqual('number');
    });
});
