import { config, userSettingsLabels } from '../../../config/config';
import { createPersistedStore } from './PersistedStore';

// The settingsStore is backed by values in config. Only values specified in userSettingsLabels
// will be persisted as cookies, and will be reset to their initial values when these values change.
export const settingsStore = createPersistedStore(
    'settings',
    config,
    Object.keys(userSettingsLabels),
    true
);

// The stateStore is fully persisted, and maintains the state of the app (informed by settingsStore)
const stateDefaults = {
    projectListState: config.defaultProjectListState,
    projectDetailState: config.defaultProjectDetailState,
    selectedProjectKey: '',
    selectedGroupName: '',
    settingsPresented: false
};
export const stateStore = createPersistedStore('state', stateDefaults);
