import { writable } from 'svelte/store';
import { config, userSettingsLabels } from '../../../config/config';
import type { AnyParamValueType } from '../ParamConfig/ParamTypes';

/**
 * Custom Svelte store that enables persistence of only specified entries in local storage.
 * These values will be reset to their initial values when these initial values change, so default
 * value updates will be reflected on next load.
 *
 * @param storeKey The key to use for this store in local storage
 * @param initialValues The initial values for this store
 * @param persistKeys The keys to persist (if not specified, all keys will be persisted)
 */
function createSemiPersistedStore<T>(storeKey: string, initialValues: T, persistKeys?: string[]) {
    let initialState = initialValues as Record<string, AnyParamValueType>;
    const keysToPersist: string[] = persistKeys || Object.keys(initialState);

    // Restore only values that are specified in keysToPersist
    const resetState = () => {
        initialState = initialValues as Record<string, AnyParamValueType>;
        for (const key of keysToPersist) {
            const lastInitialValueKey = `${storeKey}_lastInitialValue_${key}`;
            const valueKey = `${storeKey}_${key}`;
            // Use the new value from initialValues if it's been changed
            const initialValue = JSON.stringify(initialState[key]);
            const lastInitialValue = localStorage.getItem(lastInitialValueKey);
            localStorage.setItem(lastInitialValueKey, initialValue);
            if (lastInitialValue && lastInitialValue !== initialValue) {
                localStorage.setItem(valueKey, initialValue);
                continue;
            }

            // Otherwise, use the value in local storage
            initialState[key] = JSON.parse(localStorage.getItem(valueKey) || initialValue);
        }
    };
    resetState();

    // Create the backing store, using typeof config for member completion
    const { subscribe, set } = writable(initialState as T);

    // Persist only values that are specified in keysToPersist
    const setAndPersist = (state: Record<string, AnyParamValueType>) => {
        for (const key of keysToPersist) {
            localStorage.setItem(`${storeKey}_${key}`, JSON.stringify(state[key]));
        }
        set(state as T);
    };

    // Reset the store to the initial state (closure ftw)
    const reset = () => {
        resetState();
        set(initialState as T);
    };

    return {
        subscribe,
        set: setAndPersist,
        reset
    };
}

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
