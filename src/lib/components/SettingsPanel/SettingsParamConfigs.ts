import { userSettingsLabels } from '$config/settings';
import { ParamConfigDefaults, type ParamConfig } from '$lib/base/ConfigModels/ParamConfig';
import {
    BooleanParamConfigDefaults,
    type BooleanParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/BooleanParamConfig';
import {
    FunctionParamConfigDefaults,
    type FunctionParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/FunctionParamConfig';
import {
    NumberParamConfigDefaults,
    NumberParamStyle,
    type NumberParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import {
    NumericArrayParamConfigDefaults,
    NumericArrayParamStyle,
    type NumericArrayParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import {
    StringParamConfigDefaults,
    type StringParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/StringParamConfig';

// ParamConfigs for each possible entry in the Settings panel
export const settingsParamConfigs: ParamConfig[] = [
    // showExperiments
    {
        ...BooleanParamConfigDefaults,
        key: 'showExperiments'
    } as BooleanParamConfig,

    // overlayPanels
    {
        ...BooleanParamConfigDefaults,
        key: 'overlayPanels'
    } as BooleanParamConfig,

    // projectListPanelState
    {
        ...StringParamConfigDefaults,
        key: 'projectListPanelState',
        options: {
            'Visible': 'visible',
            'Hover (Pinned)': 'mouse-pinned',
            'Hover (Pinnable)': 'mouse-pinnable',
            'Hover (Unpinnable)': 'mouse-unpinnable',
            'Fixed': 'static'
        }
    } as StringParamConfig,

    // projectDetailPanelState
    {
        ...StringParamConfigDefaults,
        key: 'projectDetailPanelState',
        options: {
            'Visible': 'visible',
            'Hover (Pinned)': 'mouse-pinned',
            'Hover (Pinnable)': 'mouse-pinnable',
            'Hover (Unpinnable)': 'mouse-unpinnable',
            'Fixed': 'static',
            'Unavailable': 'unavailable'
        }
    } as StringParamConfig,

    // panelMouseTriggerWidth
    {
        ...NumberParamConfigDefaults,
        key: 'panelMouseTriggerWidth',
        style: NumberParamStyle.Field,
        min: 0,
        max: 100,
        step: 1
    } as NumberParamConfig,

    // hidePanelButtonsTimeout
    {
        ...NumberParamConfigDefaults,
        key: 'hidePanelButtonsTimeout',
        style: NumberParamStyle.Field,
        min: 0,
        max: 10000,
        step: 100
    } as NumberParamConfig,

    // projectSortOrder
    {
        ...StringParamConfigDefaults,
        key: 'projectSortOrder',
        options: {
            Alphabetical: 'alphabetical',
            Chronological: 'chronological',
            'Reverse Chron': 'reverse-chronological'
        }
    } as StringParamConfig,

    // groupSortOrder
    {
        ...StringParamConfigDefaults,
        key: 'groupSortOrder',
        options: {
            Alphabetical: 'alphabetical',
            Chronological: 'chronological',
            'Reverse Chron': 'reverse-chronological'
        }
    } as StringParamConfig,

    // alwaysShowPresets
    {
        ...BooleanParamConfigDefaults,
        key: 'alwaysShowPresets'
    } as BooleanParamConfig,

    // enablePresetExport
    {
        ...BooleanParamConfigDefaults,
        key: 'enablePresetExport'
    } as BooleanParamConfig,

    // useFullscreenCanvas
    {
        ...BooleanParamConfigDefaults,
        key: 'useFullscreenCanvas'
    } as BooleanParamConfig,

    // defaultCanvasSize
    {
        ...NumericArrayParamConfigDefaults,
        style: NumericArrayParamStyle.CompactField,
        min: 0,
        max: 5000,
        step: 1,
        key: 'defaultCanvasSize'
    } as NumericArrayParamConfig
].map((paramConfig) => {
    // Add the label to each ParamConfig from config/settings.ts
    if (paramConfig.name === ParamConfigDefaults.name) {
        paramConfig.name = userSettingsLabels[paramConfig.key];
    }
    return paramConfig;
});

export const captureVideoConfigKey = 'captureVideo';
export function captureVideoConfig(isRecording: boolean): FunctionParamConfig {
    return {
        ...FunctionParamConfigDefaults,
        name: 'Video Recording',
        key: captureVideoConfigKey,
        buttonText: isRecording ? 'Stop' : 'Start'
    } as FunctionParamConfig;
}

export const captureImageConfigKey = 'captureImage';
export const captureImageConfig: FunctionParamConfig = {
    ...FunctionParamConfigDefaults,
    name: 'Image Capture',
    key: captureImageConfigKey,
    buttonText: 'Save'
} as FunctionParamConfig;

// Keys for settings param inputs to disable while recording:
export const disableWhileRecording = ['defaultCanvasSize', 'useFullscreenCanvas'];
