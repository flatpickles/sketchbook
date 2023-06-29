/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect, vi } from 'vitest';

import ProjectConfig from '$lib/base/ProjectConfig';
import ProjectLoader from '$lib/base/ProjectLoader';
import * as fileProviders from '$lib/base/FileProviders';
import { NumberParamConfig } from '$lib/base/ParamConfig';
import Project from '$lib/base/Project';
import ConfigAndSupport from './TestProjects/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestProjects/NoConfig/NoConfig';

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
});

describe('loading projects', async () => {
    const availableProjects = await testLoader.loadAvailableProjects();

    it('does not load parameter configs until prompted', () => {
        for (const project of Object.values(availableProjects)) {
            expect(Object.values(project.params).length).toEqual(0);
        }
    });

    it('does not change available project configs after loading a project', async () => {
        await testLoader.loadProject('NoConfig');

        for (const project of Object.values(availableProjects)) {
            expect(Object.values(project.params).length).toEqual(0);
        }
    });

    it('loads a project with no config file', async () => {
        const projectTuple = await testLoader.loadProject('NoConfig');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(NoConfig);

        // Check project config
        const projectConfig = projectTuple!.config.project;
        expect(projectConfig).toBeDefined();
        expect(projectConfig?.title).toEqual('NoConfig');
        expect(projectConfig?.date).toEqual(defaultConfig.project.date);
        expect(projectConfig?.description).toEqual(defaultConfig.project.description);
        expect(projectConfig?.liveUpdates).toEqual(defaultConfig.project.liveUpdates);
        expect(projectConfig?.groups).toEqual(defaultConfig.project.groups);
        expect(projectConfig?.experimental).toEqual(defaultConfig.project.experimental);

        // Check params config
        const paramsConfig = projectTuple!.config.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(1);
        expect(paramsConfig!['testNumber']).toBeDefined();
        expect(paramsConfig!['testNumber']).toBeInstanceOf(NumberParamConfig);
    });

    it('loads a project with a config file', async () => {
        const projectTuple = await testLoader.loadProject('ConfigAndSupport');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(ConfigAndSupport);

        // Check project config
        const projectConfig = projectTuple!.config.project;
        expect(projectConfig).toBeDefined();
        expect(projectConfig?.title).toEqual('Config and Support');
        expect(projectConfig?.date).toEqual(new Date('2023-06-27'));
        expect(projectConfig?.description).toContain('config file');
        expect(projectConfig?.liveUpdates).toEqual(false);
        expect(projectConfig?.groups).toContain('Test');
        expect(projectConfig?.groups.length).toEqual(1);
        expect(projectConfig?.experimental).toEqual(true);

        // Check params config
        const paramsConfig = projectTuple!.config.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(1);
        expect(paramsConfig!['testNumber']).toBeDefined();
        expect(paramsConfig!['testNumber']).toBeInstanceOf(NumberParamConfig);
        expect(paramsConfig!['testUnusedParam']).toBeUndefined();
    });
});
