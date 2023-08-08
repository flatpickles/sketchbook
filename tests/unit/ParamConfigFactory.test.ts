import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ParamConfig/NumberParamConfig';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';
import { ParamConfigFactory } from '$lib/base/ParamConfig/ParamConfigFactory';
import type { StringParamConfig } from '$lib/base/ParamConfig/StringParamConfig';
import { describe, it, expect } from 'vitest';

describe('ParamConfigFactory', () => {
    it('creates ParamConfig objects with the correct type', () => {
        expect(ParamConfigFactory.configFrom(3, 'number').type).toEqual(ParamType.Number);
        expect(ParamConfigFactory.configFrom(true, 'bool').type).toEqual(ParamType.Boolean);
        expect(
            ParamConfigFactory.configFrom(() => {
                return;
            }, 'func').type
        ).toEqual(ParamType.Function);
        expect(ParamConfigFactory.configFrom('str', 'string').type).toEqual(ParamType.String);
        expect(ParamConfigFactory.configFrom([1, 2, 3], 'number[]').type).toEqual(
            ParamType.NumericArray
        );
    });

    it('rejects unsupported param types', () => {
        // object
        expect(() => {
            ParamConfigFactory.configFrom({}, 'param');
        }).toThrow();

        // empty array
        expect(() => {
            ParamConfigFactory.configFrom([], 'param');
        }).toThrow();

        // non-numeric array
        expect(() => {
            ParamConfigFactory.configFrom(['yes', 'no'], 'param');
        }).toThrow();
        expect(() => {
            ParamConfigFactory.configFrom([7, 'maybe'], 'param');
        }).toThrow();
    });

    it('uses the proper liveUpdates values', () => {
        expect(ParamConfigFactory.configFrom(3, 'number').liveUpdates).toEqual(true);
        expect(ParamConfigFactory.configFrom(3, 'number', {}, false).liveUpdates).toEqual(false);
    });

    it('assigns config fields to the param', () => {
        const param = ParamConfigFactory.configFrom(3, 'key', { name: 'Name', min: 1, max: 5 });
        const numberParam = param as NumberParamConfig;
        expect(numberParam.key).toEqual('key');
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

    it('rejects option string params without options array', () => {
        expect(() => {
            ParamConfigFactory.configFrom('str', 'string', { style: 'options' });
        }).toThrow();
    });

    it('assigns option style when options array is present', () => {
        const param = ParamConfigFactory.configFrom('str', 'string', {
            options: ['a', 'b', 'c']
        });
        const stringParam = param as StringParamConfig;
        expect(stringParam.style).toEqual('options');
        expect(stringParam.options).toEqual(['a', 'b', 'c']);
    });
});
