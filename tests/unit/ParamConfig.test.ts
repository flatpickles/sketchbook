import { getParamSections } from '$lib/base/ConfigModels/ParamConfig';
import { describe, it, expect } from 'vitest';
import { ParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfig';

describe('getParamSections', () => {
    it('returns empty arrays when no params are passed', () => {
        const [noSection, sections] = getParamSections([]);
        expect(noSection).toEqual([]);
        expect(sections).toEqual([]);
    });

    it('returns all params in noSection when no params have sections', () => {
        const [noSection, sections] = getParamSections([
            { ...ParamConfigDefaults, section: undefined },
            { ...ParamConfigDefaults, section: undefined },
            { ...ParamConfigDefaults, section: undefined }
        ]);
        expect(noSection).toEqual([
            { ...ParamConfigDefaults, section: undefined },
            { ...ParamConfigDefaults, section: undefined },
            { ...ParamConfigDefaults, section: undefined }
        ]);
        expect(sections).toEqual([]);
    });

    it('returns all params in sections when all params have sections', () => {
        const [noSection, sections] = getParamSections([
            { ...ParamConfigDefaults, section: 'section1' },
            { ...ParamConfigDefaults, section: 'section2' },
            { ...ParamConfigDefaults, section: 'section2' }
        ]);
        expect(noSection).toEqual([]);
        expect(sections).toEqual([
            {
                name: 'section1',
                params: [{ ...ParamConfigDefaults, section: 'section1' }]
            },
            {
                name: 'section2',
                params: [
                    { ...ParamConfigDefaults, section: 'section2' },
                    { ...ParamConfigDefaults, section: 'section2' }
                ]
            }
        ]);
    });

    it('returns params in noSection and sections when some params have sections', () => {
        const [noSection, sections] = getParamSections([
            { ...ParamConfigDefaults, section: 'section1' },
            { ...ParamConfigDefaults, section: undefined },
            { ...ParamConfigDefaults, section: 'section2' }
        ]);
        expect(noSection).toEqual([{ ...ParamConfigDefaults, section: undefined }]);
        expect(sections).toEqual([
            {
                name: 'section1',
                params: [{ ...ParamConfigDefaults, section: 'section1' }]
            },
            {
                name: 'section2',
                params: [{ ...ParamConfigDefaults, section: 'section2' }]
            }
        ]);
    });
});
