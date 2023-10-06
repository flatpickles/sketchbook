import { describe, it, expect } from 'vitest';
import ParamInference, { InferenceMode } from '$lib/base/ProjectLoading/ParamInference';
import {
    NumberParamConfigDefaults,
    type NumberParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import {
    NumericArrayParamConfigDefaults,
    type NumericArrayParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import {
    BooleanParamConfigDefaults,
    type BooleanParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/BooleanParamConfig';
import { StringParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/StringParamConfig';
import { FunctionParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/FunctionParamConfig';

describe('ParamInference.paramsWithInference', () => {
    it('supplements parameters appropriately, provided for a ts/js project file', () => {
        const rawFileText = `
        import Project from '$lib/base/Project/Project';

        export default class InferenceTest extends Project {
            rectSize = 0.5; // 0.25 to 0.75, 0.3, step 0.05, "Rect Size"
            showRect = true; // "Show Rect", false
            rectColor = '#34b00c'; // "Rect Color", 0 to 1, step 0.05
            size = [0.5, 0.5]; // "Dimensions", -1 to 1.0, step 0.25
            somethingFn = () => { // "Something Fun"
                alert('sup');
            }; // "Something Evil"
        }        
        `;
        const configs = [
            {
                ...NumberParamConfigDefaults,
                key: 'rectSize'
            },
            {
                ...BooleanParamConfigDefaults,
                key: 'showRect'
            },
            {
                ...StringParamConfigDefaults,
                key: 'rectColor'
            },
            {
                ...NumericArrayParamConfigDefaults,
                key: 'size'
            },
            {
                ...FunctionParamConfigDefaults,
                key: 'somethingFn'
            }
        ];
        const inferences = ParamInference.paramsWithInference(
            configs,
            InferenceMode.ProjectFile,
            rawFileText
        );

        // Check values
        expect(Object.values(inferences.values).length).toEqual(0);

        // Check number config
        const rectSizeConfig = inferences.configs.filter(
            (config) => config.key === 'rectSize'
        ) as NumberParamConfig[];
        expect(rectSizeConfig.length).toEqual(1);
        expect(rectSizeConfig[0].name).toEqual('Rect Size');
        expect(rectSizeConfig[0].min).toEqual(0.25);
        expect(rectSizeConfig[0].max).toEqual(0.75);
        expect(rectSizeConfig[0].step).toEqual(0.05);

        // Check bool config
        const showRectConfig = inferences.configs.filter(
            (config) => config.key === 'showRect'
        ) as BooleanParamConfig[];
        expect(showRectConfig.length).toEqual(1);
        expect(showRectConfig[0].name).toEqual('Show Rect');

        // Check string config
        const rectColorConfig = inferences.configs.filter(
            (config) => config.key === 'rectColor'
        ) as BooleanParamConfig[];
        expect(rectColorConfig.length).toEqual(1);
        expect(rectColorConfig[0].name).toEqual('Rect Color');

        // Check numeric array config
        const sizeConfig = inferences.configs.filter(
            (config) => config.key === 'size'
        ) as NumberParamConfig[];
        expect(sizeConfig.length).toEqual(1);
        expect(sizeConfig[0].name).toEqual('Dimensions');
        expect(sizeConfig[0].min).toEqual(-1);
        expect(sizeConfig[0].max).toEqual(1);
        expect(sizeConfig[0].step).toEqual(0.25);

        // Check function config
        const somethingFnConfig = inferences.configs.filter(
            (config) => config.key === 'somethingFn'
        ) as BooleanParamConfig[];
        expect(somethingFnConfig.length).toEqual(1);
        expect(somethingFnConfig[0].name).toEqual('Something Fun');
    });

    it('supplements parameters & provides values appropriately, provided a shader file', () => {
        const rawFileText = `
        precision mediump float;
        varying vec2 uv;
        uniform float time;
        uniform float numberParam; // [16, 23], 14, -1 to 20, "Numbah", step 1
        uniform bool booleanParam; // 1, true, "Boolean Something", false
        uniform vec2 arrayParam1; // -100.5 to 10, step 0.5, [-20, 5], "Pair"
        uniform vec3 arrayParam2; // "BG Color", [-0.3, 1, 0.1], -1.0 to .5, step 0.2
        
        void main() {}     
        `;
        const configs = [
            {
                ...NumberParamConfigDefaults,
                key: 'numberParam'
            },
            {
                ...BooleanParamConfigDefaults,
                key: 'booleanParam'
            },
            {
                ...NumericArrayParamConfigDefaults,
                key: 'arrayParam1'
            },
            {
                ...NumericArrayParamConfigDefaults,
                key: 'arrayParam2'
            }
        ];
        const inferences = ParamInference.paramsWithInference(
            configs,
            InferenceMode.ShaderFile,
            rawFileText
        );

        // Check values
        expect(Object.values(inferences.values).length).toEqual(4);
        expect(inferences.values['numberParam']).toEqual(14);
        expect(inferences.values['booleanParam']).toEqual(true);
        expect(inferences.values['arrayParam1']).toEqual([-20, 5]);
        expect(inferences.values['arrayParam2']).toEqual([-0.3, 1, 0.1]);

        // Check number config
        const numberConfig = inferences.configs.filter(
            (config) => config.key === 'numberParam'
        ) as NumberParamConfig[];
        expect(numberConfig.length).toEqual(1);
        expect(numberConfig[0].name).toEqual('Numbah');
        expect(numberConfig[0].min).toEqual(-1);
        expect(numberConfig[0].max).toEqual(20);
        expect(numberConfig[0].step).toEqual(1);

        // Check bool config
        const booleanConfig = inferences.configs.filter(
            (config) => config.key === 'booleanParam'
        ) as BooleanParamConfig[];
        expect(booleanConfig.length).toEqual(1);
        expect(booleanConfig[0].name).toEqual('Boolean Something');

        // Check numeric array #1 config
        const arrayConfig1 = inferences.configs.filter(
            (config) => config.key === 'arrayParam1'
        ) as NumberParamConfig[];
        expect(arrayConfig1.length).toEqual(1);
        expect(arrayConfig1[0].name).toEqual('Pair');
        expect(arrayConfig1[0].min).toEqual(-100.5);
        expect(arrayConfig1[0].max).toEqual(10);
        expect(arrayConfig1[0].step).toEqual(0.5);

        // Check numeric array #1 config
        const arrayConfig2 = inferences.configs.filter(
            (config) => config.key === 'arrayParam2'
        ) as NumberParamConfig[];
        expect(arrayConfig2.length).toEqual(1);
        expect(arrayConfig2[0].name).toEqual('BG Color');
        expect(arrayConfig2[0].min).toEqual(-1);
        expect(arrayConfig2[0].max).toEqual(0.5);
        expect(arrayConfig2[0].step).toEqual(0.2);
    });
});

describe('ParamInference.paramWithInference', () => {
    it("doesn't do anything with no comment", () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            ''
        );
        expect(inference1.config).toEqual(NumberParamConfigDefaults);
        expect(inference1.value).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            ''
        );
        expect(inference2.config).toEqual(NumericArrayParamConfigDefaults);
        expect(inference2.value).toBeUndefined();
    });

    it('assigns names', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '"foo"'
        );
        expect(inference1.config.name).toEqual('foo');
        expect(inference1.value).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            ' "banana Apple", 45, step 0.1'
        );
        expect(inference2.config.name).toEqual('banana Apple');
        expect(inference2.value).toBeUndefined();
    });

    it('assigns range and step', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '"foo", step 0.5, -14 to 32.6'
        );
        expect(inference1.config.name).toEqual('foo');
        expect((inference1.config as NumberParamConfig).min).toEqual(-14);
        expect((inference1.config as NumberParamConfig).max).toEqual(32.6);
        expect((inference1.config as NumberParamConfig).step).toEqual(0.5);
        expect(inference1.value).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            'step 0.3, -.3 to 400, "banana Apple", 45, step 0.1'
        );
        expect(inference2.config.name).toEqual('banana Apple');
        expect((inference2.config as NumericArrayParamConfig).min).toEqual(-0.3);
        expect((inference2.config as NumericArrayParamConfig).max).toEqual(400);
        expect((inference2.config as NumericArrayParamConfig).step).toEqual(0.3);
        expect(inference2.value).toBeUndefined();
    });

    it('delivers values as expected', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '23, origin, true, [74, .1, -3], -4'
        );
        expect(inference1.value).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        );
        expect(inference2.value).toBe(23);

        const inference3 = ParamInference.paramWithInference(
            BooleanParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        );
        expect(inference3.value).toBe(true);

        const inference4 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        );
        expect(inference4.value).toEqual([74, 0.1, -3]);
    });
});

describe('ParamInference.intentionsFrom', () => {
    it('returns empty object with no matches', () => {
        const intentions1 = ParamInference.intentionsFrom('');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings.length).toBe(0);
    });

    it('parses names', () => {
        const intentions1 = ParamInference.intentionsFrom('"foo"');
        expect(intentions1.name).toEqual('foo');
        const intentions2 = ParamInference.intentionsFrom('69, "foo bar"');
        expect(intentions2.name).toEqual('foo bar');
        const intentions3 = ParamInference.intentionsFrom('69 , "  foo  Bar  "   , 420');
        expect(intentions3.name).toEqual('foo  Bar');
    });

    it('parses ranges', () => {
        const intentions1 = ParamInference.intentionsFrom('0 to 1');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toEqual([0, 1]);
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('0 to 1, step 0.1');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([0, 1]);
        expect(intentions2.step).toEqual(0.1);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        console.log(intentions2.potentialStyleStrings);
        expect(intentions2.potentialStyleStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('18.6, 0.4 to -1, step 0.4');
        expect(intentions3.name).toBeUndefined();
        expect(intentions3.range).toEqual([0.4, -1]);
        expect(intentions3.step).toEqual(0.4);
        expect(intentions3.numberValues).toEqual([18.6]);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.potentialStyleStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom('-123 to 18.23, step 123, "foo"');
        expect(intentions4.name).toEqual('foo');
        expect(intentions4.range).toEqual([-123, 18.23]);
        expect(intentions4.step).toEqual(123);
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.potentialStyleStrings.length).toBe(0);

        const intentions5 = ParamInference.intentionsFrom('.1 to .6, step 0.1, "foo"');
        expect(intentions5.name).toEqual('foo');
        expect(intentions5.range).toEqual([0.1, 0.6]);
        expect(intentions5.step).toEqual(0.1);
        expect(intentions5.numberValues.length).toBe(0);
        expect(intentions5.booleanValues.length).toBe(0);
        expect(intentions5.numericArrayValues.length).toBe(0);
        expect(intentions5.potentialStyleStrings.length).toBe(0);

        const intentions6 = ParamInference.intentionsFrom('.1 to end, step 0.1, "foo"');
        expect(intentions6.name).toEqual('foo');
        expect(intentions6.range).toBeUndefined();
        expect(intentions5.step).toEqual(0.1);
        expect(intentions6.numberValues.length).toBe(0);
        expect(intentions6.booleanValues.length).toBe(0);
        expect(intentions6.numericArrayValues.length).toBe(0);
        expect(intentions6.potentialStyleStrings.length).toBe(0);
    });

    it('parses step', () => {
        const intentions1 = ParamInference.intentionsFrom('step 0.1');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toEqual(0.1);
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('step 10, 0 to 1');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([0, 1]);
        expect(intentions2.step).toEqual(10);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.potentialStyleStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('0 to 1, step -4, "foo"');
        expect(intentions3.name).toEqual('foo');
        expect(intentions3.range).toEqual([0, 1]);
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues.length).toBe(0);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.potentialStyleStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom('0 to 1, step .5, "foo"');
        expect(intentions4.name).toEqual('foo');
        expect(intentions4.range).toEqual([0, 1]);
        expect(intentions4.step).toBe(0.5);
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.potentialStyleStrings.length).toBe(0);

        const intentions5 = ParamInference.intentionsFrom('0 to 1, step .5 yep, "foo"');
        expect(intentions5.name).toEqual('foo');
        expect(intentions5.range).toEqual([0, 1]);
        expect(intentions5.step).toBeUndefined();
        expect(intentions5.numberValues.length).toBe(0);
        expect(intentions5.booleanValues.length).toBe(0);
        expect(intentions5.numericArrayValues.length).toBe(0);
        expect(intentions5.potentialStyleStrings.length).toBe(0);
    });

    it('parses booleans', () => {
        const intentions1 = ParamInference.intentionsFrom('true');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues).toEqual([true]);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('false, true');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues).toEqual([false, true]);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.potentialStyleStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('false, "true", false');
        expect(intentions3.name).toEqual('true');
        expect(intentions3.range).toBeUndefined();
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues.length).toBe(0);
        expect(intentions3.booleanValues).toEqual([false, false]);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.potentialStyleStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom(
            'false, "true", false, true yea, no false'
        );
        expect(intentions4.name).toEqual('true');
        expect(intentions4.range).toBeUndefined();
        expect(intentions4.step).toBeUndefined();
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues).toEqual([false, false]);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.potentialStyleStrings.length).toBe(0);
    });

    it('parses numbers', () => {
        const intentions1 = ParamInference.intentionsFrom('69');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues).toEqual([69]);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('69, 420');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues).toEqual([69, 420]);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.potentialStyleStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('69, "420", 69');
        expect(intentions3.name).toEqual('420');
        expect(intentions3.range).toBeUndefined();
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues).toEqual([69, 69]);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.potentialStyleStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom(
            '69.5, -420, "69", .5, step 0.1, -17.1 to 400, [1, 3, -4, 0.5]'
        );
        expect(intentions4.name).toEqual('69');
        expect(intentions4.range).toEqual([-17.1, 400]);
        expect(intentions4.step).toEqual(0.1);
        expect(intentions4.numberValues).toEqual([69.5, -420, 0.5]);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues).toEqual([[1, 3, -4, 0.5]]);
        expect(intentions4.potentialStyleStrings.length).toBe(0);
    });

    it('parses numeric arrays', () => {
        const intentions1 = ParamInference.intentionsFrom('[1, 2, 3]');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues).toEqual([[1, 2, 3]]);
        expect(intentions1.potentialStyleStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('[-1, 0.1, .6, 0.5, 0.5]');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues).toEqual([[-1, 0.1, 0.6, 0.5, 0.5]]);
        expect(intentions2.potentialStyleStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom(
            '[-1, 0.1, .6, 0.5, 0.5], 100.5, test, "[12, 3, 0.5]", [-10, 1.0]'
        );
        expect(intentions3.name).toBe('[12, 3, 0.5]');
        expect(intentions3.range).toBeUndefined();
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues).toEqual([100.5]);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues).toEqual([
            [-1, 0.1, 0.6, 0.5, 0.5],
            [-10, 1.0]
        ]);
        expect(intentions3.potentialStyleStrings).toEqual(['test']);
    });

    it('parses styles', () => {
        const intentions1 = ParamInference.intentionsFrom('test');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.potentialStyleStrings).toEqual(['test']);

        const intentions2 = ParamInference.intentionsFrom(
            'test, step, step 01, true, testDeux, false, 100.3 to 3'
        );
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([100.3, 3]);
        expect(intentions2.step).toEqual(1);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues).toEqual([true, false]);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.potentialStyleStrings).toEqual(['test', 'step', 'testDeux']);
    });
});
