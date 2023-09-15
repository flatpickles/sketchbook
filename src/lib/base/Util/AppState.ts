import { config, userSettingsLabels } from '../../../config/config';
import { createSemiPersistedStore } from './SemiPersistedStore';

// The settingsStore is backed by values in config. Only values specified in userSettingsLabels
// will be persisted, and will be reset to their initial values when these values change.
const settingsStore = createSemiPersistedStore('settings', config, Object.keys(userSettingsLabels));

// The stateStore is fully persisted, and maintains the state of the app (informed by settingsStore)
const stateDefaults = {
    projectListState: config.defaultProjectListState,
    projectDetailState: config.defaultProjectDetailState,
    selectedProjectKey: '',
    selectedGroupName: '',
    settingsPresented: false
};
const stateStore = createSemiPersistedStore('state', stateDefaults);

// Export the stores!
export { settingsStore, stateStore };
