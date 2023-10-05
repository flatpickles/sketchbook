import { describe, it, expect } from 'vitest';
import ParamInference from '$lib/base/ProjectLoading/ParamInference';

describe('ParamInference.intentionsFrom', () => {
    it('returns empty object with no matches', () => {
        expect(ParamInference.intentionsFrom('')).toEqual({});
    });

    it('parses names', () => {
        expect(ParamInference.intentionsFrom('"foo"')).toEqual({ name: 'foo' });
        expect(ParamInference.intentionsFrom('89 "foo bar"')).toEqual(
            expect.objectContaining({ name: 'foo bar' })
        );
        expect(ParamInference.intentionsFrom('89 [3, 4, 2] "  foo bar"')).toEqual(
            expect.objectContaining({ name: 'foo bar' })
        );
    });

    it('parses ranges', () => {
        expect(ParamInference.intentionsFrom('0 to 1')).toEqual({ range: [0, 1] });
        // expect(ParamInference.intentionsFrom('0 to 1 step 0.1')).toEqual({
        //     range: [0, 1],
        //     step: 0.1
        // });
        // expect(ParamInference.intentionsFrom('0 to 1 step 0.1 "foo"')).toEqual({
        //     name: 'foo',
        //     range: [0, 1],
        //     step: 0.1
        // });
    });
});
