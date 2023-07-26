import {
    type NumberParamConfig,
    NumberParamConfigDefaults
} from '$lib/base/ParamConfig/NumberParamConfig';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig/ProjectConfigFactory';
import { describe, it, expect } from 'vitest';
import ConfigAndSupport from './TestFiles/ConfigAndSupport/ConfigAndSupport';
import NoConfig from './TestFiles/NoConfig/NoConfig';

describe('ProjectConfigFactory.propsFrom', () => {
    it('creates default props without provided config data', () => {
        const props = ProjectConfigFactory.propsFrom(undefined);
        expect(props.title).toEqual(ProjectConfigDefaults.title);
        expect(props.date).toEqual(ProjectConfigDefaults.date);
        expect(props.description).toEqual(ProjectConfigDefaults.description);
        expect(props.defaultPresetName).toEqual(ProjectConfigDefaults.defaultPresetName);
        expect(props.liveUpdates).toEqual(ProjectConfigDefaults.liveUpdates);
        expect(props.groups).toEqual(ProjectConfigDefaults.groups);
        expect(props.experimental).toEqual(ProjectConfigDefaults.experimental);
    });

    it('creates config objects properly from config data', () => {
        const configData = {
            title: 'Test title',
            date: '2023-07-06',
            description: 'Test description',
            defaultPresetName: 'Test Preset',
            liveUpdates: false,
            groups: ['Test'],
            experimental: true
        };
        const props = ProjectConfigFactory.propsFrom(configData);
        expect(props.title).toEqual(configData.title);
        expect(props.date).toEqual(new Date(configData.date));
        expect(props.description).toEqual(configData.description);
        expect(props.defaultPresetName).toEqual(configData.defaultPresetName);
        expect(props.liveUpdates).toEqual(configData.liveUpdates);
        expect(props.groups).toEqual(configData.groups);
        expect(props.experimental).toEqual(configData.experimental);
    });

    it('creates config objects properly with a mix of defined & default props', () => {
        const configData = {
            title: 'Test title',
            date: '2023-07-06'
        };
        const props = ProjectConfigFactory.propsFrom(configData);
        expect(props.title).toEqual(configData.title);
        expect(props.date).toEqual(new Date(configData.date));
        expect(props.description).toEqual(ProjectConfigDefaults.description);
        expect(props.defaultPresetName).toEqual(ProjectConfigDefaults.defaultPresetName);
        expect(props.liveUpdates).toEqual(ProjectConfigDefaults.liveUpdates);
        expect(props.groups).toEqual(ProjectConfigDefaults.groups);
        expect(props.experimental).toEqual(ProjectConfigDefaults.experimental);
    });
});

describe('ProjectConfigFactory.propsFrom', () => {
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
        const params = ProjectConfigFactory.paramsFrom(testProject, paramData);
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);

        // Check default values
        expect(numberParam.name).toEqual(NumberParamConfigDefaults.name);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('loads params properly from a project object with no param config data', () => {
        // Initialize with no config data
        const testProject = new ConfigAndSupport();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramsFrom(testProject);
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        expect(testParam.type).toEqual('number');
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.name).toEqual('testNumber');
        expect(numberParam.min).toEqual(NumberParamConfigDefaults.min);
        expect(numberParam.max).toEqual(NumberParamConfigDefaults.max);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
    });

    it('applies liveUpdatesDefault properly', () => {
        // Initialize with no config data
        const testProject = new NoConfig();

        // Load parameters & check default values
        const params = ProjectConfigFactory.paramsFrom(testProject, undefined, false);
        const testParam = params.filter((param) => param.key === 'testNumber')[0];
        expect(testParam).toBeDefined();
        const numberParam = testParam as NumberParamConfig;
        expect(numberParam.liveUpdates).toEqual(false);
    });
});
