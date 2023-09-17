/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import * as Environment from '$app/environment';
import Project from '$lib/base/Project/Project';
import ConfigAndSupport from './TestFiles/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestFiles/NoConfig/NoConfig';
import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import * as fileProviders from '$lib/base/ProjectLoading/ImportProviders';
import { ParamType } from '$lib/base/ConfigModels/ParamConfig';
import ParamValueProvider from '$lib/base/ProjectLoading/ParamValueProvider';
import FragShaderProject from '$lib/base/Project/FragShaderProject';
vi.spyOn(ParamValueProvider, 'getValue');
vi.spyOn(ParamValueProvider, 'setValue');

// Use TestProjects directory for loading tests
const testProjects = import.meta.glob('/tests/unit/TestFiles/*/*.ts');
const testConfigs = import.meta.glob('/tests/unit/TestFiles/*/config.json');
const testTextFiles = import.meta.glob('/tests/unit/TestFiles/*/*.frag', { as: 'raw' });
vi.spyOn(fileProviders, 'importProjectClassFiles').mockReturnValue(testProjects);
vi.spyOn(fileProviders, 'importProjectConfigFiles').mockReturnValue(testConfigs);
vi.spyOn(fileProviders, 'importProjectTextFiles').mockReturnValue(testTextFiles);

describe('loading available projects', async () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const availableProjects = await ProjectLoader.loadAvailableProjects();

    it('has correct number of available projects', () => {
        expect(Object.values(availableProjects).length).toBe(5);
    });

    it('correctly configures a project without a config file', () => {
        const project = availableProjects['NoConfig'];
        expect(project).toBeDefined();
        expect(project?.title).toEqual('NoConfig');
        expect(project?.date).toEqual(ProjectConfigDefaults.date);
        expect(project?.description).toEqual(ProjectConfigDefaults.description);
        expect(project?.paramsApplyDuringInput).toEqual(
            ProjectConfigDefaults.paramsApplyDuringInput
        );
        expect(project?.groups).toEqual(ProjectConfigDefaults.groups);
        expect(project?.experimental).toEqual(ProjectConfigDefaults.experimental);
    });

    it('correctly configures a project with a config file', () => {
        const project = availableProjects['ConfigAndSupport'];
        expect(project).toBeDefined();
        expect(project?.title).toEqual('Config and Support');
        expect(project?.date).toEqual(new Date('2023-06-27'));
        expect(project?.description).toContain('config file');
        expect(project?.paramsApplyDuringInput).toEqual(false);
        expect(project?.groups).toContain('Test');
        expect(project?.groups.length).toEqual(1);
        expect(project?.experimental).toEqual(true);
    });

    it('correctly configures a project with a frag shader file', () => {
        const project = availableProjects['ShaderProject'];
        expect(project).toBeDefined();
        expect(project?.title).toEqual('ShaderProject');
    });

    it('does not import a project without a properly named class file', () => {
        const project = availableProjects['NoClassFile'];
        expect(project).toBeUndefined();
    });
});

describe('loading specific projects', async () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('loads a project with no config file', async () => {
        const projectTuple = await ProjectLoader.loadProject('NoConfig');
        expect(projectTuple).toBeDefined();
        expect(projectTuple?.key).toEqual('NoConfig');

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(NoConfig);

        // Check project property values
        const numberDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumber');
        expect(numberDescriptor?.value).toEqual(42);
        const functionDescriptor = Object.getOwnPropertyDescriptor(project, 'testFunction');
        expect(functionDescriptor?.value).toBeInstanceOf(Function);
        const numericArrayDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumericArray');
        expect(numericArrayDescriptor?.value).toEqual([1, 2, 3]);

        // Check project config
        const projectProps = projectTuple!.config;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('NoConfig');
        expect(projectProps?.date).toEqual(ProjectConfigDefaults.date);
        expect(projectProps?.description).toEqual(ProjectConfigDefaults.description);
        expect(projectProps?.paramsApplyDuringInput).toEqual(
            ProjectConfigDefaults.paramsApplyDuringInput
        );
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
        expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(0);
    });

    it('loads a project with a config file', async () => {
        const projectTuple = await ProjectLoader.loadProject('ConfigAndSupport');
        expect(projectTuple).toBeDefined();
        expect(projectTuple?.key).toEqual('ConfigAndSupport');

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(ConfigAndSupport);

        // Check project property values
        const numberDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumber');
        expect(numberDescriptor?.value).toEqual(42);
        const stringDescriptor = Object.getOwnPropertyDescriptor(project, 'testString');
        expect(stringDescriptor?.value).toEqual('test string');

        // Check project config
        const projectProps = projectTuple!.config;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('Config and Support');
        expect(projectProps?.date).toEqual(new Date('2023-06-27'));
        expect(projectProps?.description).toContain('config file');
        expect(projectProps?.paramsApplyDuringInput).toEqual(false);
        expect(projectProps?.groups).toContain('Test');
        expect(projectProps?.groups.length).toEqual(1);
        expect(projectProps?.experimental).toEqual(true);

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(2);
        const testNumberParam = paramsConfig.filter((param) => param.key === 'testNumber')[0];
        expect(testNumberParam).toBeDefined();
        expect(testNumberParam.type).toEqual(ParamType.Number);
        expect(testNumberParam.name).toEqual('Number Param');
        expect(testNumberParam.applyDuringInput).toEqual(true); // explicit definition
        const testBooleanParam = paramsConfig.filter((param) => param.key === 'testBoolean')[0];
        expect(testBooleanParam).toBeUndefined();
        const testStringParam = paramsConfig.filter((param) => param.key === 'testString')[0];
        expect(testStringParam).toBeDefined();
        expect(testStringParam.type).toEqual(ParamType.String);
        expect(testStringParam.name).toEqual('String Param');
        expect(testStringParam.applyDuringInput).toEqual(false); // project default
        const testUnusedParam = paramsConfig.filter((param) => param.key === 'testUnusedParam')[0];
        expect(testUnusedParam).toBeUndefined();
        expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(0);
    });

    it('loads a project with a frag shader file', async () => {
        const projectTuple = await ProjectLoader.loadProject('ShaderProject');
        expect(projectTuple).toBeDefined();
        expect(projectTuple?.key).toEqual('ShaderProject');

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(FragShaderProject);

        // Check project config
        const projectProps = projectTuple!.config;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('ShaderProject');

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();
        expect(Object.keys(paramsConfig!).length).toEqual(6);
        const testFloatParam = paramsConfig.filter((param) => param.key === 'testFloat')[0];
        expect(testFloatParam).toBeDefined();
        expect(testFloatParam.type).toEqual('number');
        const testIntParam = paramsConfig.filter((param) => param.key === 'testInt')[0];
        expect(testIntParam).toBeDefined();
        expect(testIntParam.type).toEqual('number');
        const testBoolParam = paramsConfig.filter((param) => param.key === 'testBool')[0];
        expect(testBoolParam).toBeDefined();
        expect(testBoolParam.type).toEqual('boolean');
        const testVec2Param = paramsConfig.filter((param) => param.key === 'testVec2')[0];
        expect(testVec2Param).toBeDefined();
        expect(testVec2Param.type).toEqual(ParamType.NumericArray);
        const testVec3Param = paramsConfig.filter((param) => param.key === 'testVec3')[0];
        expect(testVec3Param).toBeDefined();
        expect(testVec3Param.type).toEqual(ParamType.NumericArray);
        const testVec4Param = paramsConfig.filter((param) => param.key === 'testVec4')[0];
        expect(testVec4Param).toBeDefined();
        expect(testVec4Param.type).toEqual(ParamType.NumericArray);
        expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(0);
    });

    it('does not load a project without a properly named class file', async () => {
        const projectTuple = await ProjectLoader.loadProject('NoNamedFile');
        expect(projectTuple).toBeNull();
    });

    it('does not load a non-existent project', async () => {
        const projectTuple = await ProjectLoader.loadProject('NonExistent');
        expect(projectTuple).toBeNull();
    });

    it('throws an error when loading a project with no default export', async () => {
        await expect(ProjectLoader.loadProject('NoDefaultExport')).rejects.toThrow(
            'No default export for /tests/unit/TestFiles/NoDefaultExport/NoDefaultExport.ts'
        );
    });

    it('throws an error when loading a project that does not subclass Project', async () => {
        await expect(ProjectLoader.loadProject('NoProjectSubclass')).rejects.toThrow(
            'Project class file at path /tests/unit/TestFiles/NoProjectSubclass/NoProjectSubclass.ts is not a subclass of Project'
        );
    });
});

describe('loading specific projects, in browser mode (re: stored values)', async () => {
    beforeAll(() => {
        vi.spyOn(Environment, 'browser', 'get').mockReturnValue(true);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('loads a project with no config file', async () => {
        // Mock stored values
        const mockParamValueFn = vi.fn((key: string) => {
            if (key === 'NoConfig_testNumber') return '32';
            if (key === 'NoConfig_testNumericArray') return '[4, 5, 6]';
            return null;
        });
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(mockParamValueFn);

        // Load project
        const projectTuple = await ProjectLoader.loadProject('NoConfig');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(NoConfig);

        // Check project property values
        const numberDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumber');
        expect(numberDescriptor?.value).toEqual(32);
        const functionDescriptor = Object.getOwnPropertyDescriptor(project, 'testFunction');
        expect(functionDescriptor?.value).toBeInstanceOf(Function);
        const numericArrayDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumericArray');
        expect(numericArrayDescriptor?.value).toEqual([4, 5, 6]);

        // Check ParamValueProvider calls
        expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(3);
    });

    it('loads a project with a config file', async () => {
        // Mock stored values
        const mockParamValueFn = vi.fn((key: string) => {
            if (key === 'Config and Support_testNumber') return '32';
            if (key === 'Config and Support_testString') return '"hello world"';
            return null;
        });
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(mockParamValueFn);

        // Load project
        const projectTuple = await ProjectLoader.loadProject('ConfigAndSupport');
        expect(projectTuple).toBeDefined();

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(ConfigAndSupport);

        // Check project property values
        const numberDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumber');
        expect(numberDescriptor?.value).toEqual(32);
        const stringDescriptor = Object.getOwnPropertyDescriptor(project, 'testString');
        expect(stringDescriptor?.value).toEqual('hello world');

        // Check ParamValueProvider calls
        expect(ParamValueProvider.getValue).toHaveBeenCalledTimes(2);
    });
});
