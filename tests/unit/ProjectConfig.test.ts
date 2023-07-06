import { describe, it, expect } from 'vitest';

import ProjectConfig from '$lib/base/ProjectConfig';
import ConfigAndSupport from './TestProjects/ConfigAndSupport/ConfigAndSupport';
import { type NumberParamConfig, NumberParamConfigDefaults } from '$lib/base/ParamConfig';

describe('creating config objects', () => {
    it('creates config objects with the correct name', () => {
        const config = new ProjectConfig('Test');
        expect(config.props.title).toEqual('Test');
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
        const config = new ProjectConfig('Test', configData);
        expect(config.props.title).toEqual(configData.title);
        expect(config.props.date).toEqual(new Date(configData.date));
        expect(config.props.description).toEqual(configData.description);
        expect(config.props.defaultPresetName).toEqual(configData.defaultPresetName);
        expect(config.props.liveUpdates).toEqual(configData.liveUpdates);
        expect(config.props.groups).toEqual(configData.groups);
        expect(config.props.experimental).toEqual(configData.experimental);
    });
});

describe('loading params', () => {
    it('loads params properly from a project object with param config data', () => {
        // Initialize with sparse config data
        const testProject = new ConfigAndSupport();
        const testConfig = new ProjectConfig('Test', {
            params: {
                testNumber: {
                    min: 1,
                    max: 5
                }
            }
        });
        expect(testConfig.params).toEqual({});

        // Load parameters & check that they were loaded properly
        testConfig.loadParamsConfig(testProject);
        expect(testConfig.params['testNumber']).toBeDefined();
        expect(testConfig.params['testNumber'].type).toEqual('number');
        const numberParam = testConfig.params['testNumber'] as NumberParamConfig;
        expect(numberParam.min).toEqual(1);
        expect(numberParam.max).toEqual(5);

        // Check default values
        expect(numberParam.name).toEqual(NumberParamConfigDefaults.name);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
        expect(numberParam.options).toEqual(NumberParamConfigDefaults.options);
    });

    it('loads params properly from a project object with no param config data', () => {
        // Initialize with no config data
        const testProject = new ConfigAndSupport();
        const testConfig = new ProjectConfig('Test');
        expect(testConfig.params).toEqual({});

        // Load parameters & check default values
        testConfig.loadParamsConfig(testProject);
        expect(testConfig.params['testNumber']).toBeDefined();
        expect(testConfig.params['testNumber'].type).toEqual('number');
        const numberParam = testConfig.params['testNumber'] as NumberParamConfig;
        expect(numberParam.name).toEqual(NumberParamConfigDefaults.name);
        expect(numberParam.min).toEqual(NumberParamConfigDefaults.min);
        expect(numberParam.max).toEqual(NumberParamConfigDefaults.max);
        expect(numberParam.step).toEqual(NumberParamConfigDefaults.step);
        expect(numberParam.liveUpdates).toEqual(NumberParamConfigDefaults.liveUpdates);
        expect(numberParam.style).toEqual(NumberParamConfigDefaults.style);
        expect(numberParam.options).toEqual(NumberParamConfigDefaults.options);
    });
});
