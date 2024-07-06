import { dev } from '$app/environment';
import Cookies from 'js-cookie';
import { writable } from 'svelte/store';
import type { AnyParamValueType } from '../ConfigModels/ParamTypes';

/**
 * Custom Svelte store that enables persistence of only specified entries in cookies. These values
 * will be reset to their initial values when these initial values change, so default value updates
 * will be reflected on next load. This happens always during development, or if a prod user has
 * adjusted settings values (i.e. they're already opted-in for cookies usage).
 *
 * @param storeKey The key to use for this store (will be prefixed to all keys)
 * @param initialValues The initial values for this store
 * @param persistKeys The keys to persist (if not specified, all keys will be persisted)
 */
export function createPersistedStore<T>(
    storeKey: string,
    initialValues: T,
    persistKeys?: string[]
) {
    let initialState = initialValues as Record<string, AnyParamValueType>;
    const keysToPersist: string[] = persistKeys || Object.keys(initialState);

    // Set & get functions
    const setItem = (key: string, value: string) => {
        const prefixedKey = `${storeKey}_${key}`;
        Cookies.set(prefixedKey, value, { expires: 365 });
    };
    const getItem = (key: string) => {
        const prefixedKey = `${storeKey}_${key}`;
        return Cookies.get(prefixedKey);
    };

    // Restore only values that are specified in keysToPersist
    const resetState = () => {
        initialState = initialValues as Record<string, AnyParamValueType>;
        for (const key of keysToPersist) {
            // Derive the keys for the initial value and the last initial value
            const lastInitialValueKey = `lastInitialValue_${key}`;
            // Use the new value from initialValues if it's been changed
            const initialValue = JSON.stringify(initialState[key]);
            const lastInitialValue = getItem(lastInitialValueKey);
            if (dev || getItem(key)) setItem(lastInitialValueKey, initialValue);
            if (lastInitialValue && lastInitialValue !== initialValue) {
                setItem(key, initialValue);
                continue;
            }

            // Otherwise, use the stored or initial value
            const value = getItem(key) ?? initialValue;
            initialState[key] = JSON.parse(value);
        }
    };
    resetState();

    // Create the backing store, using typeof config for member completion
    const { subscribe, set } = writable(initialState as T);

    // Persist only values that are specified in keysToPersist
    const setAndPersist = (state: Record<string, AnyParamValueType>) => {
        for (const key of keysToPersist) {
            setItem(key, JSON.stringify(state[key]));
        }
        set(state as T);
    };

    // Load cookie values into the store, primarily for SSR
    const loadCookies = (cookies: Cookies.CookieAttributes) => {
        const stateWithCookies = { ...initialState };
        for (const key of keysToPersist) {
            const value = cookies.get(`${storeKey}_${key}`);
            if (value !== undefined) {
                stateWithCookies[key] = JSON.parse(value);
            }
        }
        set(stateWithCookies as T);
    };

    // Reset the store to the initial state (closure ftw)
    const reset = () => {
        resetState();
        set(initialState as T);
    };

    return {
        subscribe,
        set: setAndPersist,
        reset,
        loadCookies
    };
}
