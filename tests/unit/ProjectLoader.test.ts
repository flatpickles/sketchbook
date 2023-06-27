import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import ProjectConfig from '$lib/base/ProjectConfig';
import ProjectLoader from '$lib/base/ProjectLoader';
import * as fileProviders from '$lib/base/BundledFileProviders';

// Use TestProjects directory for loading tests
const testProjects = import.meta.glob('/tests/unit/TestProjects/*/*.ts');
const testConfigs = import.meta.glob('/tests/unit/TestProjects/*/config.json');
vi.spyOn(fileProviders, 'importProjectClassFiles').mockReturnValue(testProjects);
vi.spyOn(fileProviders, 'importProjectConfigFiles').mockReturnValue(testConfigs);

// Initialize some useful stuff
const testLoader: ProjectLoader = new ProjectLoader();
const defaultConfig = new ProjectConfig('Defaults');

describe('loading project configs', async () => {
    const availableProjects = await testLoader.loadAvailableProjects();

    beforeAll(() => {
        vi.restoreAllMocks();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('has correct number of available projects', () => {
        expect(Object.values(availableProjects).length).toBe(2);
    });

    it('correctly configures a project without a config file', () => {
        const project = availableProjects['NoConfig'];
        expect(project).toBeDefined();
        expect(project?.project.title).toEqual('NoConfig');
        expect(project?.project.date).toEqual(defaultConfig.project.date);
        expect(project?.project.description).toEqual(defaultConfig.project.description);
        expect(project?.project.liveUpdates).toEqual(defaultConfig.project.liveUpdates);
        expect(project?.project.groups).toEqual(defaultConfig.project.groups);
        expect(project?.project.experimental).toEqual(defaultConfig.project.experimental);
    });

    it('correctly configures a project with a config file', () => {
        const project = availableProjects['ConfigAndSupport'];
        expect(project).toBeDefined();
        expect(project?.project.title).toEqual('Config and Support');
        expect(project?.project.date).toEqual(new Date('2023-06-27'));
        expect(project?.project.description).toContain('config file');
        expect(project?.project.liveUpdates).toEqual(false);
        expect(project?.project.groups).toContain('Test');
        expect(project?.project.groups.length).toEqual(1);
        expect(project?.project.experimental).toEqual(true);
    });

    it('does not import a project without a properly named class file', () => {
        const project = availableProjects['NoClassFile'];
        expect(project).toBeUndefined();
    });

    it('does not load parameter configs until prompted', () => {
        for (const project of Object.values(availableProjects)) {
            expect(Object.values(project.params).length).toEqual(0);
            expect(Object.values(project.paramSections).length).toEqual(0);
        }
    });
});

// describe('loading parameter configs', () => {});
