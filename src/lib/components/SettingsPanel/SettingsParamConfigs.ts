import type { ParamConfig } from '$lib/base/ConfigModels/ParamConfig';
import {
    BooleanParamConfigDefaults,
    type BooleanParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/BooleanParamConfig';
import {
    NumericArrayParamConfigDefaults,
    type NumericArrayParamConfig,
    NumericArrayParamStyle
} from '$lib/base/ConfigModels/ParamConfigs/NumericArrayParamConfig';
import {
    StringParamConfigDefaults,
    type StringParamConfig
} from '$lib/base/ConfigModels/ParamConfigs/StringParamConfig';
import { userSettingsLabels } from '../../../config/settings';

// ParamConfigs for each possible entry in the Settings panel
// todo: add more settings
export const settingsParamConfigs: ParamConfig[] = [
    {
        ...BooleanParamConfigDefaults,
        key: 'showExperiments'
    } as BooleanParamConfig,
    {
        ...StringParamConfigDefaults,
        key: 'projectSortOrder',
        options: {
            Alphabetical: 'alphabetical',
            Chronological: 'chronological',
            'Reverse Chron': 'reverse-chronological'
        }
    } as StringParamConfig,
    {
        ...NumericArrayParamConfigDefaults,
        key: 'canvasSize',
        style: NumericArrayParamStyle.CompactField,
        step: 1,
        min: 0,
        max: 100000
    } as NumericArrayParamConfig,
    {
        ...BooleanParamConfigDefaults,
        key: 'overlayPanels'
    } as BooleanParamConfig
].map((paramConfig) => {
    // Add the label to each ParamConfig from config/settings.ts
    paramConfig.name = userSettingsLabels[paramConfig.key];
    return paramConfig;
});
