import Cookies from 'js-cookie';
import { writable } from 'svelte/store';
import type { AnyParamValueType } from '../ConfigModels/ParamTypes';

/**
 * Custom Svelte store that enables persistence of only specified entries in either localStorage
 * or cookies. These values will be reset to their initial values when these initial values change,
 * so default value updates will be reflected on next load during development.
 *
 * @param storeKey The key to use for this store (will be prefixed to all keys)
 * @param initialValues The initial values for this store
 * @param persistKeys The keys to persist (if not specified, all keys will be persisted)
 * @param useCookies Whether to use cookies instead of local storage (e.g. if needed in requests)
 */
export function createPersistedStore<T>(
    storeKey: string,
    initialValues: T,
    useCookies = false,
    persistKeys?: string[]
) {
    let initialState = initialValues as Record<string, AnyParamValueType>;
    const keysToPersist: string[] = persistKeys || Object.keys(initialState);

    // Set & get functions
    const setItem = (key: string, value: string, useCookies = false) => {
        const prefixedKey = `${storeKey}_${key}`;
        if (useCookies) Cookies.set(prefixedKey, value, { expires: 365 });
        else localStorage.setItem(prefixedKey, value);
    };
    const getItem = (key: string, useCookies = false) => {
        const prefixedKey = `${storeKey}_${key}`;
        if (useCookies) return Cookies.get(prefixedKey);
        else return localStorage.getItem(prefixedKey);
    };

    // Restore only values that are specified in keysToPersist
    const resetState = () => {
        initialState = initialValues as Record<string, AnyParamValueType>;
        for (const key of keysToPersist) {
            // Check to make sure this key exists in the initial state
            if (initialState[key] === undefined)
                throw new Error(`Key ${key} not found in initial state`);
            // Derive the keys for the initial value and the last initial value
            const lastInitialValueKey = `lastInitialValue_${key}`;
            // Use the new value from initialValues if it's been changed
            const initialValue = JSON.stringify(initialState[key]);
            const lastInitialValue = getItem(lastInitialValueKey);
            setItem(lastInitialValueKey, initialValue);
            if (lastInitialValue && lastInitialValue !== initialValue) {
                setItem(key, initialValue, useCookies);
                continue;
            }

            // Otherwise, use the stored value
            const value = getItem(key, useCookies) || initialValue;
            initialState[key] = JSON.parse(value);
        }
    };
    resetState();

    // Create the backing store, using typeof config for member completion
    const { subscribe, set } = writable(initialState as T);

    // Persist only values that are specified in keysToPersist
    const setAndPersist = (state: Record<string, AnyParamValueType>) => {
        for (const key of keysToPersist) {
            setItem(key, JSON.stringify(state[key]), useCookies);
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
