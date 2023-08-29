import { browser } from '$app/environment';
import type { ParamConfig } from '../ParamConfig/ParamConfig';
import type { ParamValueType } from '../ParamConfig/ParamTypes';
import type Project from '../Project/Project';

export default class ParamValueProvider {
    public static getValue<T extends ParamConfig>(
        paramConfig: T,
        projectKey: string,
        project: Project
    ): ParamValueType<T> {
        let returnValue: ParamValueType<T>;

        // Use local storage value, or project property value as a backup
        const storedValue =
            browser &&
            localStorage.getItem(ParamValueProvider.#localStorageKey(projectKey, paramConfig.key));
        if (storedValue) {
            returnValue = JSON.parse(storedValue);
        } else {
            const descriptor = Object.getOwnPropertyDescriptor(project, paramConfig.key);
            returnValue = descriptor?.value;
        }

        // Validate that the value exists
        if (returnValue === undefined) {
            throw new Error(`ParamValueProvider: value for ${paramConfig.key} is undefined`);
        }

        // If it's an array, we need to copy it so that we don't mutate the original
        return (Array.isArray(returnValue) ? [...returnValue] : returnValue) as ParamValueType<T>;
    }

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
        return `${projectKey} - ${paramKey}`;
    }
}
