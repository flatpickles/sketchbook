import type { FileParamConfig } from '$lib/base/ParamConfig/FileParamConfig';
import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ParamConfig/NumberParamConfig';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';
import { ParamConfigFactory } from '$lib/base/ParamConfig/ParamConfigFactory';
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
        expect(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ParamConfigFactory.configFrom((result: HTMLImageElement) => {
                return;
            }, 'func').type
        ).toEqual(ParamType.File);
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

    it('validates image file param configuration', () => {
        const imageConfig = ParamConfigFactory.configFrom(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (result: HTMLImageElement) => {
                return;
            },
            'func',
            { mode: 'image' }
        ) as FileParamConfig;
        expect(imageConfig.accept).toEqual('image/*');

        // Accepts image/png for an image mode file
        expect(() => {
            ParamConfigFactory.configFrom(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (result: HTMLImageElement) => {
                    return;
                },
                'func',
                { mode: 'image', accept: 'image/png' }
            );
        }).not.toThrow();

        // Doesn't accept audio/mp3 for an image mode file
        expect(() => {
            ParamConfigFactory.configFrom(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (result: HTMLImageElement) => {
                    return;
                },
                'func',
                { mode: 'image', accept: 'audio/mp3' }
            );
        }).toThrow();
    });

    it('validates array param values', () => {
        // Color 0-255
        expect(() => {
            ParamConfigFactory.configFrom([0, 100, 255], 'param', { style: 'color' });
        }).not.toThrow();
        // Color 0-1
        expect(() => {
            ParamConfigFactory.configFrom([0, 0.5, 1], 'param', { style: 'unitColor' });
        }).not.toThrow();

        // Must have 3 elements
        expect(() => {
            ParamConfigFactory.configFrom([1, 2, 3, 4], 'param', { style: 'color' });
        }).toThrow();
        // Out of bounds 0-255
        expect(() => {
            ParamConfigFactory.configFrom([0, 100, 256], 'param', { style: 'color' });
        }).toThrow();
        // Out of bounds 0-1
        expect(() => {
            ParamConfigFactory.configFrom([0, 100, 255], 'param', { style: 'unitColor' });
        }).toThrow();
        // Non-integer values 0-255
        expect(() => {
            ParamConfigFactory.configFrom([0, 100.5, 255], 'param', { style: 'color' });
        }).toThrow();
    });
});
