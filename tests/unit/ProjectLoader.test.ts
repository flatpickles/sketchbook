/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import * as Environment from '$app/environment';
import Project from '$lib/base/Project/Project';
import ConfigAndSupport from './TestFiles/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestFiles/NoConfig/NoConfig';
import EmptyConfig from './TestFiles/EmptyConfig/EmptyConfig';
import ProjectLoader from '$lib/base/ProjectLoading/ProjectLoader';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import * as fileProviders from '$lib/base/ProjectLoading/ImportProviders';
import { ParamType } from '$lib/base/ConfigModels/ParamConfig';
import ParamValueProvider from '$lib/base/ProjectLoading/ParamValueProvider';
import FragShaderProject from '$lib/base/Project/FragShaderProject';
import {
    NumberParamConfigDefaults,
    type NumberParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import type { BooleanParamConfig } from '$lib/base/ConfigModels/ParamConfigs/BooleanParamConfig';
import type { NumericArrayParamConfig } from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
vi.spyOn(ParamValueProvider, 'getValue');
vi.spyOn(ParamValueProvider, 'setValue');

// Use TestProjects directory for loading tests
const testProjects = import.meta.glob('/tests/unit/TestFiles/*/*.ts');
const testRawFiles = import.meta.glob('/tests/unit/TestFiles/*/*.(ts|js|frag)', { as: 'raw' });
const testConfigs = import.meta.glob('/tests/unit/TestFiles/*/config.json', { as: 'raw' });
const testTextFiles = import.meta.glob('/tests/unit/TestFiles/*/*.frag', { as: 'raw' });
vi.spyOn(fileProviders, 'importProjectClassFiles').mockReturnValue(testProjects);
vi.spyOn(fileProviders, 'importProjectConfigFiles').mockReturnValue(testConfigs);
vi.spyOn(fileProviders, 'importRawProjectFiles').mockReturnValue(testRawFiles);
vi.spyOn(fileProviders, 'importProjectTextFiles').mockReturnValue(testTextFiles);

describe('loading available projects', async () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const availableProjects = await ProjectLoader.loadAvailableProjects();

    it('has correct number of available projects', () => {
        expect(Object.values(availableProjects).length).toBe(8);
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
        const unlistedParam2 = paramsConfig.filter((param) => param.key === 'internalProperty2')[0];
        expect(unlistedParam2).toBeUndefined();
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

    it('loads a project with an empty (broken) config file', async () => {
        const projectTuple = await ProjectLoader.loadProject('EmptyConfig');
        expect(projectTuple).toBeDefined();
        expect(projectTuple?.key).toEqual('EmptyConfig');

        // Check project class instance
        const project = projectTuple!.project;
        expect(project).toBeDefined();
        expect(project).toBeInstanceOf(Project);
        expect(project).toBeInstanceOf(EmptyConfig);

        // Check project property values
        const numberDescriptor = Object.getOwnPropertyDescriptor(project, 'testNumber');
        expect(numberDescriptor?.value).toEqual(42);
        const stringDescriptor = Object.getOwnPropertyDescriptor(project, 'testString');
        expect(stringDescriptor?.value).toEqual('test string');

        // Check project config
        const projectProps = projectTuple!.config;
        expect(projectProps).toBeDefined();
        expect(projectProps?.title).toEqual('EmptyConfig');
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
        expect(Object.keys(paramsConfig!).length).toEqual(2);
        const testNumberParam = paramsConfig.filter((param) => param.key === 'testNumber')[0];
        expect(testNumberParam).toBeDefined();
        expect(testNumberParam.type).toEqual(ParamType.Number);
        expect(testNumberParam.name).toEqual('testNumber');
        expect(testNumberParam.applyDuringInput).toEqual(true); // explicit definition
        const testBooleanParam = paramsConfig.filter((param) => param.key === 'testBoolean')[0];
        expect(testBooleanParam).toBeUndefined();
        const testStringParam = paramsConfig.filter((param) => param.key === 'testString')[0];
        expect(testStringParam).toBeDefined();
        expect(testStringParam.type).toEqual(ParamType.String);
        expect(testStringParam.name).toEqual('testString');
        expect(testStringParam.applyDuringInput).toEqual(
            ProjectConfigDefaults.paramsApplyDuringInput
        );
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
            if (key === 'ConfigAndSupport_testNumber') return '32';
            if (key === 'ConfigAndSupport_testString') return '"hello world"';
            return null;
        });
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(mockParamValueFn);

        // Load project
        const projectTuple = await ProjectLoader.loadProject('ConfigAndSupport');

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

describe('loading projects w/ inline / inferred config', async () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("doesn't use inference when disabled", async () => {
        const projectTuple = await ProjectLoader.loadProject('ConfigAndSupport');

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();

        // Check number config
        const testNumberParam = paramsConfig.filter(
            (param) => param.key === 'testNumber'
        )[0] as NumberParamConfig;
        expect(testNumberParam).toBeDefined();
        expect(testNumberParam.type).toEqual(ParamType.Number);
        expect(testNumberParam.min).toEqual(NumberParamConfigDefaults.min);
        expect(testNumberParam.max).toEqual(NumberParamConfigDefaults.max);
        expect(testNumberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(testNumberParam.style).not.toEqual('field');
        expect(testNumberParam.name).not.toEqual('Number Name');

        // Check string config
        const testStringParam = paramsConfig.filter((param) => param.key === 'testString')[0];
        expect(testStringParam).toBeDefined();
        expect(testStringParam.name).not.toEqual('String Name');
    });

    it('infers config in ts file when enabled', async () => {
        const projectTuple = await ProjectLoader.loadProject('TSWithInference');

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();

        // Check number config #1
        const testNumberParam1 = paramsConfig.filter(
            (param) => param.key === 'testNumber1'
        )[0] as NumberParamConfig;
        expect(testNumberParam1).toBeDefined();
        expect(testNumberParam1.type).toEqual(ParamType.Number);
        expect(testNumberParam1.min).toEqual(-100);
        expect(testNumberParam1.max).toEqual(100);
        expect(testNumberParam1.step).toEqual(1);
        expect(testNumberParam1.default).toBeUndefined();
        expect(testNumberParam1.style).toEqual(NumberParamConfigDefaults.style);
        expect(testNumberParam1.name).toEqual('Number Name');

        // Check number config #2
        const testNumberParam2 = paramsConfig.filter(
            (param) => param.key === 'testNumber2'
        )[0] as NumberParamConfig;
        expect(testNumberParam2).toBeDefined();
        expect(testNumberParam2.type).toEqual(ParamType.Number);
        expect(testNumberParam2.min).toEqual(30);
        expect(testNumberParam2.max).toEqual(40);
        expect(testNumberParam2.step).toEqual(0.5);
        expect(testNumberParam2.default).toBeUndefined();
        expect(testNumberParam2.style).toEqual('slider');
        expect(testNumberParam2.name).toEqual('Number 2');
    });

    it('infers config and values in shader file when enabled, and applies values & defaults', async () => {
        const projectTuple = await ProjectLoader.loadProject('ShaderWithInference');

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();

        // Check number config #1
        const testNumberParam1 = paramsConfig.filter(
            (param) => param.key === 'testNumber1'
        )[0] as NumberParamConfig;
        expect(testNumberParam1).toBeDefined();
        expect(testNumberParam1.type).toEqual(ParamType.Number);
        expect(testNumberParam1.min).toEqual(-100);
        expect(testNumberParam1.max).toEqual(100);
        expect(testNumberParam1.step).toEqual(1);
        expect(testNumberParam1.default).toEqual(42);
        expect(testNumberParam1.style).toEqual(NumberParamConfigDefaults.style);
        expect(testNumberParam1.name).toEqual('Number Name');
        const actualValue = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'testNumber1'
        )!.value;
        expect(actualValue).toEqual(42);

        // Check number config #2
        const testNumberParam2 = paramsConfig.filter(
            (param) => param.key === 'testNumber2'
        )[0] as NumberParamConfig;
        expect(testNumberParam2).toBeDefined();
        expect(testNumberParam2.type).toEqual(ParamType.Number);
        expect(testNumberParam2.min).toEqual(30);
        expect(testNumberParam2.max).toEqual(40);
        expect(testNumberParam2.step).toEqual(0.01);
        expect(testNumberParam2.default).toEqual(35);
        expect(testNumberParam2.style).toEqual('slider');
        expect(testNumberParam2.name).toEqual('Number Param');
        const actualValue2 = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'testNumber2'
        )!.value;
        expect(actualValue2).toEqual(35);

        // Check boolean config
        const testBooleanParam = paramsConfig.filter(
            (param) => param.key === 'testBoolean'
        )[0] as BooleanParamConfig;
        expect(testBooleanParam).toBeDefined();
        expect(testBooleanParam.type).toEqual(ParamType.Boolean);
        expect(testBooleanParam.default).toEqual(true);
        expect(testBooleanParam.name).toEqual('testBoolean');
        const actualValue3 = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'testBoolean'
        )!.value;
        expect(actualValue3).toEqual(true);

        // Check numeric array config #1
        const testNumericArrayParam1 = paramsConfig.filter(
            (param) => param.key === 'array1'
        )[0] as NumericArrayParamConfig;
        expect(testNumericArrayParam1).toBeDefined();
        expect(testNumericArrayParam1.type).toEqual(ParamType.NumericArray);
        expect(testNumericArrayParam1.default).toEqual([0.1, 0.5, 0.9]);
        expect(testNumericArrayParam1.name).toEqual('Array');
        const actualValue4 = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'array1'
        )!.value;
        expect(actualValue4).toEqual([0.1, 0.5, 0.9]);

        // Check numeric array config #2
        const testNumericArrayParam2 = paramsConfig.filter(
            (param) => param.key === 'array2'
        )[0] as NumericArrayParamConfig;
        expect(testNumericArrayParam2).toBeDefined();
        expect(testNumericArrayParam2.type).toEqual(ParamType.NumericArray);
        expect(testNumericArrayParam2.default).toEqual([15, 25]);
        expect(testNumericArrayParam2.name).toEqual('array2');
        const actualValue5 = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'array2'
        )!.value;
        expect(actualValue5).toEqual([15, 25]);
    });
});

describe('default value loading from config', async () => {
    it('applies defaults from config file (ts/js project)', async () => {
        const projectTuple = await ProjectLoader.loadProject('TSWithInference');

        // Check params config
        const paramsConfig = projectTuple!.params;
        expect(paramsConfig).toBeDefined();

        // Check number config #3 (default application)
        const testNumberParam3 = paramsConfig.filter(
            (param) => param.key === 'testNumber3'
        )[0] as NumberParamConfig;
        expect(testNumberParam3.default).toEqual(21);
        const actualValue = Object.getOwnPropertyDescriptor(
            projectTuple!.project,
            'testNumber3'
        )!.value;
        expect(actualValue).toEqual(21);
    });

    it('throws an error with the wrong default type', async () => {
        expect(ProjectLoader.loadProject('BadDefaultType')).rejects.toThrow(
            'Default value for testString has incorrect type: number'
        );
    });

    it('throws an error with the wrong default length', async () => {
        expect(ProjectLoader.loadProject('BadDefaultLength')).rejects.toThrow(
            'Default value for testArray has incorrect length: 2'
        );
    });
});
