import { config } from '$config/settings';
import { createPersistedStore } from './PersistedStore';

// The settingsStore is backed by values in config. Only values specified in userSettingsLabels
// will be persisted as cookies, and will be reset to their initial values when these values change.
export const settingsStore = createPersistedStore('settings', config, true);

// The stateStore is fully persisted, and maintains the state of the app
const stateDefaults = {
    settingsPresented: false
};
export const stateStore = createPersistedStore('state', stateDefaults);
