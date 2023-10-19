import { describe, it, expect } from 'vitest';
import ParamInference, { InferenceMode } from '$lib/base/ProjectLoading/ParamInference';
import {
    NumberParamConfigDefaults,
    type NumberParamConfig,
    NumberParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import {
    NumericArrayParamConfigDefaults,
    type NumericArrayParamConfig,
    NumericArrayParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import {
    BooleanParamConfigDefaults,
    type BooleanParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/BooleanParamConfig';
import {
    FileParamConfigDefaults,
    type FileParamConfig,
    FileReaderMode
} from '$lib/base/ConfigModels/ParamConfigs/FileParamConfig';
import {
    StringParamConfigDefaults,
    type StringParamConfig,
    StringParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/StringParamConfig';

describe('ParamInference.paramAnnotations', () => {
    it('returns empty object with no matches', () => {
        const annotations1 = ParamInference.paramAnnotations([], InferenceMode.ShaderFile, '');
        expect(Object.entries(annotations1).length).toBe(0);
    });

    it('returns annotations in ProjectMode', () => {
        const annotations1 = ParamInference.paramAnnotations(
            ['foo', 'baz'],
            InferenceMode.ProjectFile,
            `
            import Project from '$lib/base/Project/Project';

            export default class InferenceTest extends Project {
                foo = 0; //     "Foo"
                bar = 0;   // "Bar"
                baz = 0; //   "Baz" // "Baz2"
            }        
            `
        );
        expect(Object.entries(annotations1).length).toBe(2);
        expect(annotations1['foo']).toEqual('"Foo"');
        expect(annotations1['baz']).toEqual('"Baz" // "Baz2"');
    });

    it('returns annotations in ShaderMode', () => {
        const annotations1 = ParamInference.paramAnnotations(
            ['foo', 'baz'],
            InferenceMode.ShaderFile,
            `
            precision mediump float;
            varying vec2 uv;
            uniform float time;
            uniform float foo;  //   "Foo"
            uniform float bar; // "Bar"
            uniform float baz;    //   "Baz" // "Baz2"
            
            void main() {}     
            `
        );
        expect(Object.entries(annotations1).length).toBe(2);
        expect(annotations1['foo']).toEqual('"Foo"');
        expect(annotations1['baz']).toEqual('"Baz" // "Baz2"');
    });

    it("doesn't return annotations in None mode", () => {
        const annotations1 = ParamInference.paramAnnotations(
            ['foo', 'baz'],
            InferenceMode.None,
            `
            precision mediump float;
            varying vec2 uv;
            uniform float time;
            uniform float foo;  //   "Foo"
            uniform float bar; // "Bar"
            uniform float baz;    //   "Baz" // "Baz2"
            
            void main() {}     
            `
        );
        expect(Object.entries(annotations1).length).toBe(0);
    });

    it('properly parses annotations for functions', () => {
        const annotations1 = ParamInference.paramAnnotations(
            ['foo', 'bar', 'baz'],
            InferenceMode.ProjectFile,
            `
            import Project from '$lib/base/Project/Project';

            export default class InferenceTest extends Project {
                foo = () => { // "Foo"
                    // "Not Foo"
                }
                bar = ()=>{
                    // "Bar"
                }
                baz = ()    =>  {
                    console.log('baz');
                    // "Baz"
                }
            }        
            `
        );
        expect(Object.entries(annotations1).length).toBe(2);
        expect(annotations1['foo']).toEqual('"Foo"');
        expect(annotations1['bar']).toEqual('"Bar"');
    });
});

describe('ParamInference.paramWithInference', () => {
    it("doesn't do anything with no comment", () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            ''
        ) as NumberParamConfig;
        expect(inference1).toEqual(NumberParamConfigDefaults);
        expect(inference1.default).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            ''
        ) as NumericArrayParamConfig;
        expect(inference2).toEqual(NumericArrayParamConfigDefaults);
        expect(inference2.default).toBeUndefined();
    });

    it('assigns names', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '"foo"'
        ) as NumberParamConfig;
        expect(inference1.name).toEqual('foo');
        expect(inference1.default).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            ' "banana Apple", 45, step 0.1'
        ) as NumericArrayParamConfig;
        expect(inference2.name).toEqual('banana Apple');
        expect(inference2.default).toBeUndefined();
    });

    it('assigns range and step', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '"foo", step 0.5, -14 to 32.6'
        ) as NumberParamConfig;
        expect(inference1.name).toEqual('foo');
        expect(inference1.min).toEqual(-14);
        expect(inference1.max).toEqual(32.6);
        expect(inference1.step).toEqual(0.5);
        expect(inference1.default).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            'step 0.3, -.3 to 400, "banana Apple", 45, step 0.1'
        ) as NumericArrayParamConfig;
        expect(inference2.name).toEqual('banana Apple');
        expect(inference2.min).toEqual(-0.3);
        expect(inference2.max).toEqual(400);
        expect(inference2.step).toEqual(0.3);
        expect(inference2.default).toBeUndefined();
    });

    it('assigns default values as expected', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '23, origin, true, [74, .1, -3], -4'
        ) as NumberParamConfig;
        expect(inference1.default).toBeUndefined();

        const inference2 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        ) as NumberParamConfig;
        expect(inference2.default).toBe(23);

        const inference3 = ParamInference.paramWithInference(
            BooleanParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        ) as BooleanParamConfig;
        expect(inference3.default).toBe(true);

        const inference4 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, [74, .1, -3], -4'
        ) as NumericArrayParamConfig;
        expect(inference4.default).toEqual([74, 0.1, -3]);
    });

    it('assigns numeric array value from hex string', () => {
        const inference1 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, -4, #ff00ff'
        ) as NumericArrayParamConfig;
        expect(inference1.default).toEqual([1, 0, 1]);

        const inference2 = ParamInference.paramWithInference(
            NumericArrayParamConfigDefaults,
            InferenceMode.ShaderFile,
            '23, origin, true, -4, #9933cc'
        ) as NumericArrayParamConfig;
        expect(inference2.default).toEqual([0.6, 0.2, 0.8]);
    });

    it('assigns metadata (styles, etc)', () => {
        const inference1 = ParamInference.paramWithInference(
            NumberParamConfigDefaults,
            InferenceMode.ProjectFile,
            '23, origin, true, [74, .1, -3], -4, slider'
        ) as NumberParamConfig;
        expect(inference1.style).toEqual(NumberParamStyle.Slider);

        const inference2 = ParamInference.paramWithInference(
            {
                ...NumericArrayParamConfigDefaults,
                key: 'arrayColor'
            },
            InferenceMode.ProjectFile,
            ''
        ) as NumericArrayParamConfig;
        expect(inference2.style).toEqual(NumericArrayParamStyle.UnitColor);

        const inference3 = ParamInference.paramWithInference(
            {
                ...FileParamConfigDefaults,
                key: 'multipleFiles'
            },
            InferenceMode.ProjectFile,
            '"Not a DataURL", image'
        ) as FileParamConfig;
        expect(inference3.mode).toEqual(FileReaderMode.Image);
        expect(inference3.multiple).toBe(true);
    });
});

describe('ParamInference.assignMeta', () => {
    it('returns the same object with an empty array', () => {
        const withMeta = ParamInference.assignMeta(NumericArrayParamConfigDefaults, []);
        expect(withMeta).toEqual(NumericArrayParamConfigDefaults);
    });

    it('assigns styles for numbers from metaStrings', () => {
        const withMeta = ParamInference.assignMeta(NumberParamConfigDefaults, [
            'snacks',
            'slider'
        ]) as NumberParamConfig;
        expect(withMeta.style).toEqual(NumberParamStyle.Slider);
    });

    it('assigns styles for numbers from key', () => {
        const withMeta = ParamInference.assignMeta(
            {
                ...NumberParamConfigDefaults,
                key: 'numberSlider'
            },
            ['snacks']
        ) as NumberParamConfig;
        expect(withMeta.style).toEqual(NumberParamStyle.Slider);
    });

    it('prefers explicit metaStrings vs key', () => {
        const withMeta = ParamInference.assignMeta(
            {
                ...NumberParamConfigDefaults,
                key: 'numberSlider'
            },
            ['snacks', 'field']
        ) as NumberParamConfig;
        expect(withMeta.style).toEqual(NumberParamStyle.Field);
    });

    it('assigns styles for numeric arrays from metaStrings', () => {
        const withMeta = ParamInference.assignMeta(NumericArrayParamConfigDefaults, [
            'snacks',
            'color'
        ]) as NumericArrayParamConfig;
        expect(withMeta.style).toEqual(NumericArrayParamStyle.UnitColor);
    });

    it('assigns styles for numeric arrays from key', () => {
        const withMeta = ParamInference.assignMeta(
            {
                ...NumericArrayParamConfigDefaults,
                key: 'arraySliders'
            },
            ['snacks']
        ) as NumericArrayParamConfig;
        expect(withMeta.style).toEqual(NumericArrayParamStyle.Slider);
    });

    it('assigns styles for strings from metaStrings', () => {
        const withMeta = ParamInference.assignMeta(StringParamConfigDefaults, [
            'snacks',
            'color',
            'multi'
        ]) as StringParamConfig;
        expect(withMeta.style).toEqual(StringParamStyle.MultiLine);
    });

    it('assigns styles for numeric arrays from key', () => {
        const withMeta = ParamInference.assignMeta(
            { ...StringParamConfigDefaults, key: 'multilineString' },
            ['snacks']
        ) as StringParamConfig;
        expect(withMeta.style).toEqual(StringParamStyle.MultiLine);
    });

    it('assigns assorted metadata for file params from metaStrings and key', () => {
        const withMeta = ParamInference.assignMeta(
            { ...FileParamConfigDefaults, key: 'multiFileSelector' },
            ['binaryString', 'snacks']
        ) as FileParamConfig;
        expect(withMeta.mode).toEqual(FileReaderMode.BinaryString);
        expect(withMeta.multiple).toBe(true);
    });

    it('assigns meta from name even with no metaStrings', () => {
        const withMeta = ParamInference.assignMeta(
            {
                ...NumericArrayParamConfigDefaults,
                key: 'arraySliders'
            },
            undefined
        ) as NumericArrayParamConfig;
        expect(withMeta.style).toEqual(NumericArrayParamStyle.Slider);
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
        expect(intentions1.metaStrings.length).toBe(0);
    });

    it('parses names', () => {
        const intentions1 = ParamInference.intentionsFrom('"foo"');
        expect(intentions1.name).toEqual('foo');
        const intentions2 = ParamInference.intentionsFrom('69, "foo bar"');
        expect(intentions2.name).toEqual('foo bar');
        const intentions3 = ParamInference.intentionsFrom('69 , "  foo  Bar  "   , 420');
        expect(intentions3.name).toEqual('foo  Bar');
        const intentions4 = ParamInference.intentionsFrom("69, 'foo bar'");
        expect(intentions4.name).toEqual('foo bar');
    });

    it('parses ranges', () => {
        const intentions1 = ParamInference.intentionsFrom('0 to 1');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toEqual([0, 1]);
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('0 to 1, step 0.1');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([0, 1]);
        expect(intentions2.step).toEqual(0.1);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('18.6, 0.4 to -1, step 0.4');
        expect(intentions3.name).toBeUndefined();
        expect(intentions3.range).toEqual([0.4, -1]);
        expect(intentions3.step).toEqual(0.4);
        expect(intentions3.numberValues).toEqual([18.6]);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.metaStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom('-123 to 18.23, step 123, "foo"');
        expect(intentions4.name).toEqual('foo');
        expect(intentions4.range).toEqual([-123, 18.23]);
        expect(intentions4.step).toEqual(123);
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.metaStrings.length).toBe(0);

        const intentions5 = ParamInference.intentionsFrom('.1 to .6, step 0.1, "foo"');
        expect(intentions5.name).toEqual('foo');
        expect(intentions5.range).toEqual([0.1, 0.6]);
        expect(intentions5.step).toEqual(0.1);
        expect(intentions5.numberValues.length).toBe(0);
        expect(intentions5.booleanValues.length).toBe(0);
        expect(intentions5.numericArrayValues.length).toBe(0);
        expect(intentions5.metaStrings.length).toBe(0);

        const intentions6 = ParamInference.intentionsFrom('.1 to end, step 0.1, "foo"');
        expect(intentions6.name).toEqual('foo');
        expect(intentions6.range).toBeUndefined();
        expect(intentions5.step).toEqual(0.1);
        expect(intentions6.numberValues.length).toBe(0);
        expect(intentions6.booleanValues.length).toBe(0);
        expect(intentions6.numericArrayValues.length).toBe(0);
        expect(intentions6.metaStrings.length).toBe(0);
    });

    it('parses step', () => {
        const intentions1 = ParamInference.intentionsFrom('step 0.1');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toEqual(0.1);
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('step 10, 0 to 1');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([0, 1]);
        expect(intentions2.step).toEqual(10);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('0 to 1, step -4, "foo"');
        expect(intentions3.name).toEqual('foo');
        expect(intentions3.range).toEqual([0, 1]);
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues.length).toBe(0);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.metaStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom('0 to 1, step .5, "foo"');
        expect(intentions4.name).toEqual('foo');
        expect(intentions4.range).toEqual([0, 1]);
        expect(intentions4.step).toBe(0.5);
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.metaStrings.length).toBe(0);

        const intentions5 = ParamInference.intentionsFrom('0 to 1, step .5 yep, "foo"');
        expect(intentions5.name).toEqual('foo');
        expect(intentions5.range).toEqual([0, 1]);
        expect(intentions5.step).toBeUndefined();
        expect(intentions5.numberValues.length).toBe(0);
        expect(intentions5.booleanValues.length).toBe(0);
        expect(intentions5.numericArrayValues.length).toBe(0);
        expect(intentions5.metaStrings.length).toBe(0);
    });

    it('parses booleans', () => {
        const intentions1 = ParamInference.intentionsFrom('true');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues).toEqual([true]);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('false, true');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues).toEqual([false, true]);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('false, "true", false');
        expect(intentions3.name).toEqual('true');
        expect(intentions3.range).toBeUndefined();
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues.length).toBe(0);
        expect(intentions3.booleanValues).toEqual([false, false]);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.metaStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom(
            'false, "true", false, true yea, no false'
        );
        expect(intentions4.name).toEqual('true');
        expect(intentions4.range).toBeUndefined();
        expect(intentions4.step).toBeUndefined();
        expect(intentions4.numberValues.length).toBe(0);
        expect(intentions4.booleanValues).toEqual([false, false]);
        expect(intentions4.numericArrayValues.length).toBe(0);
        expect(intentions4.metaStrings.length).toBe(0);
    });

    it('parses numbers', () => {
        const intentions1 = ParamInference.intentionsFrom('69');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues).toEqual([69]);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('69, 420');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues).toEqual([69, 420]);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings.length).toBe(0);

        const intentions3 = ParamInference.intentionsFrom('69, "420", 69');
        expect(intentions3.name).toEqual('420');
        expect(intentions3.range).toBeUndefined();
        expect(intentions3.step).toBeUndefined();
        expect(intentions3.numberValues).toEqual([69, 69]);
        expect(intentions3.booleanValues.length).toBe(0);
        expect(intentions3.numericArrayValues.length).toBe(0);
        expect(intentions3.metaStrings.length).toBe(0);

        const intentions4 = ParamInference.intentionsFrom(
            '69.5, -420, "69", .5, step 0.1, -17.1 to 400, [1, 3, -4, 0.5]'
        );
        expect(intentions4.name).toEqual('69');
        expect(intentions4.range).toEqual([-17.1, 400]);
        expect(intentions4.step).toEqual(0.1);
        expect(intentions4.numberValues).toEqual([69.5, -420, 0.5]);
        expect(intentions4.booleanValues.length).toBe(0);
        expect(intentions4.numericArrayValues).toEqual([[1, 3, -4, 0.5]]);
        expect(intentions4.metaStrings.length).toBe(0);
    });

    it('parses numeric arrays', () => {
        const intentions1 = ParamInference.intentionsFrom('[1, 2, 3]');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues).toEqual([[1, 2, 3]]);
        expect(intentions1.metaStrings.length).toBe(0);

        const intentions2 = ParamInference.intentionsFrom('[-1, 0.1, .6, 0.5, 0.5]');
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toBeUndefined();
        expect(intentions2.step).toBeUndefined();
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues.length).toBe(0);
        expect(intentions2.numericArrayValues).toEqual([[-1, 0.1, 0.6, 0.5, 0.5]]);
        expect(intentions2.metaStrings.length).toBe(0);

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
        expect(intentions3.metaStrings).toEqual(['test']);
    });

    it('parses styles', () => {
        const intentions1 = ParamInference.intentionsFrom('test');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings).toEqual(['test']);

        const intentions2 = ParamInference.intentionsFrom(
            'test, step, step 01, true, testDeux, false, 100.3 to 3'
        );
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([100.3, 3]);
        expect(intentions2.step).toEqual(1);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues).toEqual([true, false]);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings).toEqual(['test', 'step', 'testDeux']);
    });

    it('includes hex strings in metaStrings', () => {
        const intentions1 = ParamInference.intentionsFrom('#dd00ff');
        expect(intentions1.name).toBeUndefined();
        expect(intentions1.range).toBeUndefined();
        expect(intentions1.step).toBeUndefined();
        expect(intentions1.numberValues.length).toBe(0);
        expect(intentions1.booleanValues.length).toBe(0);
        expect(intentions1.numericArrayValues.length).toBe(0);
        expect(intentions1.metaStrings).toEqual(['#dd00ff']);

        const intentions2 = ParamInference.intentionsFrom(
            '#ff00ff, step, step 01, true, testDeux, false, 100.3 to 3'
        );
        expect(intentions2.name).toBeUndefined();
        expect(intentions2.range).toEqual([100.3, 3]);
        expect(intentions2.step).toEqual(1);
        expect(intentions2.numberValues.length).toBe(0);
        expect(intentions2.booleanValues).toEqual([true, false]);
        expect(intentions2.numericArrayValues.length).toBe(0);
        expect(intentions2.metaStrings).toEqual(['#ff00ff', 'step', 'testDeux']);
    });
});
