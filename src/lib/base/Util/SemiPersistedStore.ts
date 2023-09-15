import { writable } from 'svelte/store';
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
export function createSemiPersistedStore<T>(
    storeKey: string,
    initialValues: T,
    persistKeys?: string[]
) {
    let initialState = initialValues as Record<string, AnyParamValueType>;
    const keysToPersist: string[] = persistKeys || Object.keys(initialState);

    // Restore only values that are specified in keysToPersist
    const resetState = () => {
        initialState = initialValues as Record<string, AnyParamValueType>;
        for (const key of keysToPersist) {
            // Check to make sure this key exists in the initial state
            if (initialState[key] === undefined)
                throw new Error(`Key ${key} not found in initial state`);
            // Derive the keys for the initial value and the last initial value
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
            const value = localStorage.getItem(valueKey) || initialValue;
            initialState[key] = JSON.parse(value);
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
