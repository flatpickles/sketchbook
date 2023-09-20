import { browser } from '$app/environment';
import type { ParamConfig } from '../ConfigModels/ParamConfig';
import type { ParamValueType } from '../ConfigModels/ParamTypes';
import type Project from '../Project/Project';

export default class ParamValueProvider {
    /**
     * Get the value for a given param config, using the project object as a source of truth. To
     * ease the development experience, this will track changed values in the original object state
     * and use those as the new value if they change, i.e. changed project file values will override
     * stored values (when initialLoad is true). This is similar to the behavior in PersistedStore.
     */
    public static getValue<T extends ParamConfig>(
        paramConfig: T,
        projectKey: string,
        project: Project,
        initialLoad = false
    ): ParamValueType<T> {
        // Get the current value from the project object
        const objectValue = Object.getOwnPropertyDescriptor(project, paramConfig.key)?.value;

        // If this is a function, just use the object value
        if (typeof objectValue === 'function') {
            return objectValue;
        }

        // Get stored values, and track the previous object value
        const storedValueKey = ParamValueProvider.#localStorageKey(projectKey, paramConfig.key);
        const previousValueKey = `lastInitialValue_${storedValueKey}`;
        const storedValue =
            browser &&
            localStorage.getItem(ParamValueProvider.#localStorageKey(projectKey, paramConfig.key));
        const previousObjectValue = browser && localStorage.getItem(previousValueKey);
        browser && localStorage.setItem(previousValueKey, JSON.stringify(objectValue));

        // If object value has changed (during initialLoad), use this as the new value, and return.
        // If not, and there's a stored value, use the stored value. If there's no stored value,
        // use the object value.
        if (
            initialLoad &&
            previousObjectValue &&
            JSON.stringify(objectValue) !== previousObjectValue
        ) {
            ParamValueProvider.setValue(paramConfig, projectKey, objectValue);
            return objectValue;
        } else if (storedValue) {
            return JSON.parse(storedValue);
        } else {
            return objectValue;
        }
    }

    /**
     * Set the value for a given param config. This does not set the value on the project object;
     * it only stores the value in local storage.
     */
    public static setValue<T extends ParamConfig>(
        paramConfig: T,
        projectKey: string,
        value: ParamValueType<T>
    ) {
        // Store the value in local storage
        if (browser) {
            localStorage.setItem(
                ParamValueProvider.#localStorageKey(projectKey, paramConfig.key),
                JSON.stringify(value)
            );
        }
    }

    static #localStorageKey(projectKey: string, paramKey: string): string {
        return `${projectKey}_${paramKey}`;
    }
}
