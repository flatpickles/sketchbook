import { describe, it, expect, vi, beforeAll } from 'vitest';

import ConfigLoader, { SketchbookConfigDefaults } from '$lib/base/ConfigLoader';
import * as fileProviders from '$lib/base/FileProviders';

describe('config w/ good config file', async () => {
    beforeAll(async () => {
        const testConfigFile = Object.values(
            import.meta.glob('/tests/unit/TestFiles/GoodConfig.json')
        )[0];
        vi.spyOn(fileProviders, 'importSketchbookConfigFile').mockReturnValue(testConfigFile);
    });

    it('loads a config file', async () => {
        const config = await ConfigLoader.loadSketchbookConfig();
        expect(config).toBeDefined();
        expect(config.title).toEqual('Test Title');
        expect(config.subtitle).toEqual('Test Subtitle');
        expect(config.description).toEqual('Test Description');
    });

    it('applies defaults correctly', async () => {
        const config = await ConfigLoader.loadSketchbookConfig();
        expect(config).toBeDefined();
        expect(config.sorting).toEqual(SketchbookConfigDefaults.sorting);
        expect(config.defaultGroup).toEqual(SketchbookConfigDefaults.defaultGroup);
        expect(config.storeParamValues).toEqual(SketchbookConfigDefaults.storeParamValues);
        expect(config.storeProjectSelection).toEqual(
            SketchbookConfigDefaults.storeProjectSelection
        );
    });
});

describe('config w/ bad config file', async () => {
    beforeAll(async () => {
        const testConfigFile = Object.values(
            import.meta.glob('/tests/unit/TestFiles/BadConfig.json')
        )[0];
        vi.spyOn(fileProviders, 'importSketchbookConfigFile').mockReturnValue(testConfigFile);
    });

    it('throws an error when config file is invalid', async () => {
        await expect(ConfigLoader.loadSketchbookConfig()).rejects.toThrow();
    });
});

describe('config w/out config file', async () => {
    beforeAll(async () => {
        vi.spyOn(fileProviders, 'importSketchbookConfigFile').mockReturnValue(undefined);
    });

    it('loads all defaults when no config file is present', async () => {
        const config = await ConfigLoader.loadSketchbookConfig();
        expect(config).toBeDefined();
        expect(config.title).toEqual(SketchbookConfigDefaults.title);
        expect(config.subtitle).toEqual(SketchbookConfigDefaults.subtitle);
        expect(config.description).toEqual(SketchbookConfigDefaults.description);
        expect(config.sorting).toEqual(SketchbookConfigDefaults.sorting);
        expect(config.defaultGroup).toEqual(SketchbookConfigDefaults.defaultGroup);
        expect(config.storeParamValues).toEqual(SketchbookConfigDefaults.storeParamValues);
        expect(config.storeProjectSelection).toEqual(
            SketchbookConfigDefaults.storeProjectSelection
        );
    });
});
