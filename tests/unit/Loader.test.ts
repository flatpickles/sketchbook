import { describe, it, expect, vi } from 'vitest';

import { SketchbookLoader } from '$lib/base/Loader';
import * as fileProviders from '$lib/base/BundledFileProviders';

// Use TestProjects directory for loading tests
const testProjects = import.meta.glob('/tests/unit/TestProjects/*/*.ts');
const testConfigs = import.meta.glob('/tests/unit/TestProjects/*/config.json');
vi.spyOn(fileProviders, 'importProjectClassFiles').mockReturnValue(testProjects);
vi.spyOn(fileProviders, 'importProjectConfigFiles').mockReturnValue(testConfigs);

describe('project imports', () => {
    it('has correct number of available projects', () => {
        const newLoader = new SketchbookLoader();
        expect(Object.values(newLoader.availableProjects).length).toBe(2);
    });
});
