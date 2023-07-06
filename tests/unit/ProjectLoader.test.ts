/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect, vi } from 'vitest';

import ProjectConfig from '$lib/base/ProjectConfig';
import ProjectLoader from '$lib/base/ProjectLoader';
import * as fileProviders from '$lib/base/FileProviders';
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
        expect(project?.props.title).toEqual('NoConfig');
        expect(project?.props.date).toEqual(defaultConfig.props.date);
        expect(project?.props.description).toEqual(defaultConfig.props.description);
        expect(project?.props.liveUpdates).toEqual(defaultConfig.props.liveUpdates);
        expect(project?.props.groups).toEqual(defaultConfig.props.groups);
        expect(project?.props.experimental).toEqual(defaultConfig.props.experimental);
    });

    it('correctly configures a project with a config file', () => {
        const project = availableProjects['ConfigAndSupport'];
        expect(project).toBeDefined();
        expect(project?.props.title).toEqual('Config and Support');
        expect(project?.props.date).toEqual(new Date('2023-06-27'));
        expect(project?.props.description).toContain('config file');
        expect(project?.props.liveUpdates).toEqual(false);
        expect(project?.props.groups).toContain('Test');
        expect(project?.props.groups.length).toEqual(1);
        expect(project?.props.experimental).toEqual(true);
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
        const projectProps = projectTuple!.config.props;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('NoConfig');
        expect(projectProps?.date).toEqual(defaultConfig.props.date);
        expect(projectProps?.description).toEqual(defaultConfig.props.description);
        expect(projectProps?.liveUpdates).toEqual(defaultConfig.props.liveUpdates);
        expect(projectProps?.groups).toEqual(defaultConfig.props.groups);
        expect(projectProps?.experimental).toEqual(defaultConfig.props.experimental);

        // Check params config
        const paramsConfig = projectTuple!.config.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(1);
        expect(paramsConfig!['testNumber']).toBeDefined();
        expect(paramsConfig!['testNumber'].type).toEqual('number');
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
        const projectProps = projectTuple!.config.props;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('Config and Support');
        expect(projectProps?.date).toEqual(new Date('2023-06-27'));
        expect(projectProps?.description).toContain('config file');
        expect(projectProps?.liveUpdates).toEqual(false);
        expect(projectProps?.groups).toContain('Test');
        expect(projectProps?.groups.length).toEqual(1);
        expect(projectProps?.experimental).toEqual(true);

        // Check params config
        const paramsConfig = projectTuple!.config.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(1);
        expect(paramsConfig!['testNumber']).toBeDefined();
        expect(paramsConfig!['testNumber'].type).toEqual('number');
        expect(paramsConfig!['testUnusedParam']).toBeUndefined();
    });

    // todo check loading non-existent projects
});
