import {
    type NumberParamConfig,
    NumberParamConfigDefaults,
    NumberParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectLoading/ProjectConfigFactory';
import { describe, it, expect } from 'vitest';
import ConfigAndSupport from './TestFiles/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestFiles/NoConfig/NoConfig';
import { InferenceMode } from '$lib/base/ProjectLoading/ParamInference';
import {
    NumericArrayParamStyle,
    type NumericArrayParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';

describe('ProjectConfigFactory.projectConfigFrom', () => {
    it('creates default props without provided config data', () => {
        const props = ProjectConfigFactory.projectConfigFrom(undefined);
        expect(props.title).toEqual(ProjectConfigDefaults.title);
        expect(props.date).toEqual(ProjectConfigDefaults.date);
        expect(props.description).toEqual(ProjectConfigDefaults.description);
        expect(props.paramsApplyDuringInput).toEqual(ProjectConfigDefaults.paramsApplyDuringInput);
        expect(props.groups).toEqual(ProjectConfigDefaults.groups);
        expect(props.experimental).toEqual(ProjectConfigDefaults.experimental);
    });

    it('creates config objects properly from config data', () => {
        const configData = {
            title: 'Test title',
            date: '2023-07-06',
            description: 'Test description',
            defaultPresetName: 'Test Preset',
            paramsApplyDuringInput: false,
            groups: ['Test'],
            experimental: true
        };
        const props = ProjectConfigFactory.projectConfigFrom(configData);
        expect(props.title).toEqual(configData.title);
        expect(props.date).toEqual(new Date(configData.date));
        expect(props.description).toEqual(configData.description);
        expect(props.paramsApplyDuringInput).toEqual(configData.paramsApplyDuringInput);
        expect(props.groups).toEqual(configData.groups);
        expect(props.experimental).toEqual(configData.experimental);
    });

    it('creates config objects properly with a mix of defined & default props', () => {
        const configData = {
            title: 'Test title',
            date: '2023-07-06'
        };
        const props = ProjectConfigFactory.projectConfigFrom(configData);
        expect(props.title).toEqual(configData.title);
        expect(props.date).toEqual(new Date(configData.date));
        expect(props.description).toEqual(ProjectConfigDefaults.description);
        expect(props.paramsApplyDuringInput).toEqual(ProjectConfigDefaults.paramsApplyDuringInput);
        expect(props.groups).toEqual(ProjectConfigDefaults.groups);
        expect(props.experimental).toEqual(ProjectConfigDefaults.experimental);
    });
});

describe('ProjectConfigFactory.paramConfigsFrom', () => {
    it('loads params properly from a project object with param config data', () => {
        // Initialize with sparse config data
        const testProject = new ConfigAndSupport();
        const paramData = {
            testNumber: {
                min: 1,
                max: 5
            }
        };

        // Load parameters & check that they were loaded properly
        const params = ProjectConfigFactory.paramConfigsFrom(
            testProject,
            '',
            InferenceMode.ProjectFile,
            paramData
        );
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);

        // Check default values
        expect(numberParam.name).toEqual('testNumber');
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.applyDuringInput).toEqual(NumberParamConfigDefaults.applyDuringInput);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('loads params properly from a project object with no param config data', () => {
        // Initialize with no config data
        const testProject = new ConfigAndSupport();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramConfigsFrom(
            testProject,
            '',
            InferenceMode.ProjectFile
        );
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.name).toEqual('testNumber');
        expect(numberParam.min).toEqual(NumberParamConfigDefaults.min);
        expect(numberParam.max).toEqual(NumberParamConfigDefaults.max);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.applyDuringInput).toEqual(NumberParamConfigDefaults.applyDuringInput);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('loads params properly from a project object with inference but no config data', () => {
        // Initialize with no config data
        const testProject = new ConfigAndSupport();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramConfigsFrom(
            testProject,
            `import Project from '$lib/base/Project/Project';
            export default class ConfigAndSupport extends Project {
                testNumber = 42; // -100 to 100, step 1, "Number Name", field
                testString = 'test string'; // "String Name"
                arrayColor = [0.1, 0.2, 0.3];
                #internalProperty = 42;
            }`,
            InferenceMode.ProjectFile
        );
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.name).toEqual('Number Name');
        expect(numberParam.min).toEqual(-100);
        expect(numberParam.max).toEqual(100);
        expect(numberParam.step).toEqual(1);
        expect(numberParam.applyDuringInput).toEqual(NumberParamConfigDefaults.applyDuringInput);
        expect(numberParam.style).toEqual(NumberParamStyle.Field);
        const arrayParam = params.filter(
            (param) => param.key === 'arrayColor'
        )[0] as NumericArrayParamConfig;
        expect(arrayParam).toBeDefined();
        expect(arrayParam.type).toEqual('numericArray');
        expect(arrayParam.style).toEqual(NumericArrayParamStyle.UnitColor);
    });

    it('loads params properly from a project object with inference and config data', () => {
        // Initialize with no config data
        const testProject = new ConfigAndSupport();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramConfigsFrom(
            testProject,
            `import Project from '$lib/base/Project/Project';

            export default class ConfigAndSupport extends Project {
                testNumber = 42; // -100 to 100, step 1, "Number Name", field
                testString = 'test string'; // "String Name"
                #internalProperty = 42;
            }`,
            InferenceMode.ProjectFile,
            {
                testNumber: {
                    min: 1,
                    max: 5
                }
            }
        );
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.name).toEqual('Number Name');
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);
        expect(numberParam.step).toEqual(1);
        expect(numberParam.applyDuringInput).toEqual(NumberParamConfigDefaults.applyDuringInput);
        expect(numberParam.style).toEqual(NumberParamStyle.Field);
    });

    it('applies applyDuringInputDefault properly', () => {
        // Initialize with no config data
        const testProject = new NoConfig();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramConfigsFrom(
            testProject,
            '',
            InferenceMode.ProjectFile,
            undefined,
            false
        );
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.applyDuringInput).toEqual(false);
    });
});
