/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect, vi } from 'vitest';

import Project from '$lib/base/Project';
import ConfigAndSupport from './TestFiles/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestFiles/NoConfig/NoConfig';
import ProjectLoader from '$lib/base/FileLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import * as fileProviders from '$lib/base/FileLoading/FileProviders';
import { ParamType } from '$lib/base/ParamConfig/ParamConfig';

// Use TestProjects directory for loading tests
const testProjects = import.meta.glob('/tests/unit/TestFiles/*/*.ts');
const testConfigs = import.meta.glob('/tests/unit/TestFiles/*/config.json');
vi.spyOn(fileProviders, 'importProjectClassFiles').mockReturnValue(testProjects);
vi.spyOn(fileProviders, 'importProjectConfigFiles').mockReturnValue(testConfigs);

describe('loading available projects', async () => {
    const availableProjects = await ProjectLoader.loadAvailableProjects();

    it('has correct number of available projects', () => {
        expect(Object.values(availableProjects).length).toBe(2);
    });

    it('correctly configures a project without a config file', () => {
        const project = availableProjects['NoConfig'];
        expect(project).toBeDefined();
        expect(project?.title).toEqual('NoConfig');
        expect(project?.date).toEqual(ProjectConfigDefaults.date);
        expect(project?.description).toEqual(ProjectConfigDefaults.description);
        expect(project?.liveUpdates).toEqual(ProjectConfigDefaults.liveUpdates);
        expect(project?.groups).toEqual(ProjectConfigDefaults.groups);
        expect(project?.experimental).toEqual(ProjectConfigDefaults.experimental);
    });

    it('correctly configures a project with a config file', () => {
        const project = availableProjects['ConfigAndSupport'];
        expect(project).toBeDefined();
        expect(project?.title).toEqual('Config and Support');
        expect(project?.date).toEqual(new Date('2023-06-27'));
        expect(project?.description).toContain('config file');
        expect(project?.liveUpdates).toEqual(false);
        expect(project?.groups).toContain('Test');
        expect(project?.groups?.length).toEqual(1);
        expect(project?.experimental).toEqual(true);
    });

    it('does not import a project without a properly named class file', () => {
        const project = availableProjects['NoClassFile'];
        expect(project).toBeUndefined();
    });
});

describe('loading specific projects', async () => {
    it('loads a project with no config file', async () => {
        const projectTuple = await ProjectLoader.loadProject('NoConfig');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(NoConfig);

        // Check project config
        const projectProps = projectTuple!.props;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('NoConfig');
        expect(projectProps?.date).toEqual(ProjectConfigDefaults.date);
        expect(projectProps?.description).toEqual(ProjectConfigDefaults.description);
        expect(projectProps?.liveUpdates).toEqual(ProjectConfigDefaults.liveUpdates);
        expect(projectProps?.groups).toEqual(ProjectConfigDefaults.groups);
        expect(projectProps?.experimental).toEqual(ProjectConfigDefaults.experimental);

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(3);
        const testNumberParam = paramsConfig.filter((param) => param.key === 'testNumber')[0];
        expect(testNumberParam).toBeDefined();
        expect(testNumberParam.type).toEqual('number');
        const unlistedParam = paramsConfig.filter((param) => param.key === '#internalProperty')[0];
        expect(unlistedParam).toBeUndefined();
        const testFunctionParam = paramsConfig.filter((param) => param.key === 'testFunction')[0];
        expect(testFunctionParam).toBeDefined();
        expect(testFunctionParam.type).toEqual(ParamType.Function);
        const testNumericArrayParam = paramsConfig.filter(
            (param) => param.key === 'testNumericArray'
        );
        expect(testNumericArrayParam).toBeDefined();
        expect(testNumericArrayParam[0].type).toEqual(ParamType.NumericArray);
    });

    it('loads a project with a config file', async () => {
        const projectTuple = await ProjectLoader.loadProject('ConfigAndSupport');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(ConfigAndSupport);

        // Check project config
        const projectProps = projectTuple!.props;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('Config and Support');
        expect(projectProps?.date).toEqual(new Date('2023-06-27'));
        expect(projectProps?.description).toContain('config file');
        expect(projectProps?.liveUpdates).toEqual(false);
        expect(projectProps?.groups).toContain('Test');
        expect(projectProps?.groups?.length).toEqual(1);
        expect(projectProps?.experimental).toEqual(true);

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(2);
        const testNumberParam = paramsConfig.filter((param) => param.key === 'testNumber')[0];
        expect(testNumberParam).toBeDefined();
        expect(testNumberParam.type).toEqual(ParamType.Number);
        expect(testNumberParam.name).toEqual('Number Param');
        expect(testNumberParam.liveUpdates).toEqual(true); // explicit definition
        const testBooleanParam = paramsConfig.filter((param) => param.key === 'testBoolean')[0];
        expect(testBooleanParam).toBeUndefined();
        const testStringParam = paramsConfig.filter((param) => param.key === 'testString')[0];
        expect(testStringParam).toBeDefined();
        expect(testStringParam.type).toEqual(ParamType.String);
        expect(testStringParam.name).toEqual('String Param');
        expect(testStringParam.liveUpdates).toEqual(false); // project default
        const testUnusedParam = paramsConfig.filter((param) => param.key === 'testUnusedParam')[0];
        expect(testUnusedParam).toBeUndefined();
    });

    it('does not load a project without a properly named class file', async () => {
        const projectTuple = await ProjectLoader.loadProject('NoNamedFile');
        expect(projectTuple).toBeNull();
    });

    it('does not load a non-existent project', async () => {
        const projectTuple = await ProjectLoader.loadProject('NonExistent');
        expect(projectTuple).toBeNull();
    });
});
