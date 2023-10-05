import { describe, it, expect } from 'vitest';
import ParamInference from '$lib/base/ProjectLoading/ParamInference';

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
