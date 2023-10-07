import type { FileParamConfig } from '$lib/base/ConfigModels/ParamConfigs/FileParamConfig';
import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { ParamType } from '$lib/base/ConfigModels/ParamConfig';
import { ParamConfigFactory } from '$lib/base/ProjectLoading/ParamConfigFactory';
import { describe, it, expect } from 'vitest';
import { InferenceMode } from '$lib/base/ProjectLoading/ParamInference';

describe('ParamConfigFactory', () => {
    it('creates ParamConfig objects with the correct type', () => {
        expect(
            ParamConfigFactory.paramConfigFrom(3, 'number', InferenceMode.None, '').type
        ).toEqual(ParamType.Number);
        expect(
            ParamConfigFactory.paramConfigFrom(true, 'bool', InferenceMode.None, '').type
        ).toEqual(ParamType.Boolean);
        expect(
            ParamConfigFactory.paramConfigFrom(
                () => {
                    return;
                },
                'func',
                InferenceMode.None,
                ''
            ).type
        ).toEqual(ParamType.Function);
        expect(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ParamConfigFactory.paramConfigFrom(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (result: HTMLImageElement) => {
                    return;
                },
                'func',
                InferenceMode.None,
                ''
            ).type
        ).toEqual(ParamType.File);
        expect(
            ParamConfigFactory.paramConfigFrom('str', 'string', InferenceMode.None, '').type
        ).toEqual(ParamType.String);
        expect(
            ParamConfigFactory.paramConfigFrom([1, 2, 3], 'number[]', InferenceMode.None, '').type
        ).toEqual(ParamType.NumericArray);
    });

    it('rejects unsupported param types', () => {
        // object
        expect(() => {
            ParamConfigFactory.paramConfigFrom({}, 'param', InferenceMode.None);
        }).toThrow();

        // empty array
        expect(() => {
            ParamConfigFactory.paramConfigFrom([], 'param', InferenceMode.None);
        }).toThrow();

        // non-numeric array
        expect(() => {
            ParamConfigFactory.paramConfigFrom(['yes', 'no'], 'param', InferenceMode.None);
        }).toThrow();
        expect(() => {
            ParamConfigFactory.paramConfigFrom([7, 'maybe'], 'param', InferenceMode.None);
        }).toThrow();
    });

    it('uses the proper applyDuringInput values', () => {
        expect(
            ParamConfigFactory.paramConfigFrom(3, 'number', InferenceMode.None).applyDuringInput
        ).toEqual(true);
        expect(
            ParamConfigFactory.paramConfigFrom(3, 'number', InferenceMode.None, '', {}, false)
                .applyDuringInput
        ).toEqual(false);
    });

    it('assigns config fields to the param', () => {
        const param = ParamConfigFactory.paramConfigFrom(3, 'key', InferenceMode.None, '', {
            name: 'Name',
            min: 1,
            max: 5
        });
        const numberParam = param as NumberParamConfig;
        expect(numberParam.key).toEqual('key');
        expect(numberParam.name).toEqual('Name');
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.applyDuringInput).toEqual(NumberParamConfigDefaults.applyDuringInput);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('rejects unsupported config fields', () => {
        expect(() => {
            ParamConfigFactory.paramConfigFrom(3, 'param', InferenceMode.None, '', {
                bad: 'field'
            });
        }).toThrow();
    });

    it('assigns default names properly without config', () => {
        const param1 = ParamConfigFactory.paramConfigFrom(3, 'number', InferenceMode.None, '');
        expect(param1.name).toEqual('number');
    });

    it('validates image file param configuration', () => {
        const imageConfig = ParamConfigFactory.paramConfigFrom(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (result: HTMLImageElement) => {
                return;
            },
            'func',
            InferenceMode.None,
            '',
            { mode: 'image' }
        ) as FileParamConfig;
        expect(imageConfig.accept).toEqual('image/*');

        // Accepts image/png for an image mode file
        expect(() => {
            ParamConfigFactory.paramConfigFrom(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (result: HTMLImageElement) => {
                    return;
                },
                'func',
                InferenceMode.None,
                '',
                { mode: 'image', accept: 'image/png' }
            );
        }).not.toThrow();

        // Doesn't accept audio/mp3 for an image mode file
        expect(() => {
            ParamConfigFactory.paramConfigFrom(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (result: HTMLImageElement) => {
                    return;
                },
                'func',
                InferenceMode.None,
                '',
                { mode: 'image', accept: 'audio/mp3' }
            );
        }).toThrow();
    });

    it('validates array param values', () => {
        // Color 0-255
        expect(() => {
            ParamConfigFactory.paramConfigFrom([0, 100, 255], 'param', InferenceMode.None, '', {
                style: 'color'
            });
        }).not.toThrow();
        // Color 0-1
        expect(() => {
            ParamConfigFactory.paramConfigFrom([0, 0.5, 1], 'param', InferenceMode.None, '', {
                style: 'unitColor'
            });
        }).not.toThrow();

        // Must have 3 elements
        expect(() => {
            ParamConfigFactory.paramConfigFrom([1, 2, 3, 4], 'param', InferenceMode.None, '', {
                style: 'color'
            });
        }).toThrow();
        // Out of bounds 0-255
        expect(() => {
            ParamConfigFactory.paramConfigFrom([0, 100, 256], 'param', InferenceMode.None, '', {
                style: 'color'
            });
        }).toThrow();
        // Out of bounds 0-1
        expect(() => {
            ParamConfigFactory.paramConfigFrom([0, 100, 255], 'param', InferenceMode.None, '', {
                style: 'unitColor'
            });
        }).toThrow();
        // Non-integer values 0-255
        expect(() => {
            ParamConfigFactory.paramConfigFrom([0, 100.5, 255], 'param', InferenceMode.None, '', {
                style: 'color'
            });
        }).toThrow();
    });
});
