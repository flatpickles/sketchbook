import type { AnyParamValueType, ParamValueType } from '../ConfigModels/ParamTypes';
import ParamValueProvider from './ParamValueProvider';
import { defaultPresetKey } from './PresetLoader';
import type { ProjectTuple } from './ProjectLoader';

export default class PresetUtil {
    /**
     * Get the key of the currently selected preset for a project from local storage.
     * @param projectKey - The key of the project.
     * @returns The key of the currently selected preset.
     */
    public static getSelectedPresetKey(projectKey: string): string {
        return localStorage.getItem(`selectedPreset_${projectKey}`) ?? defaultPresetKey;
    }

    /**
     * Set the key of the currently selected preset for a project in local storage.
     * @param projectKey - The key of the project.
     * @param presetKey - The key of the preset to select.
     */
    public static setSelectedPresetKey(projectKey: string, presetKey: string) {
        localStorage.setItem(`selectedPreset_${projectKey}`, presetKey);
    }

    /**
     * Apply a preset to a project. This will update the project's values and the stored state, and
     * optionally call a callback function for each updated parameter (e.g. to update the displayed
     * value in the UI). This will throw an error if the preset values are not compatible with the
     * project's parameters.
     * @param projectTuple - The project tuple to apply the preset to.
     * @param presetKey - The key of the preset to apply.
     * @param paramUpdated - An optional callback function to call for each updated parameter.
     */
    public static applyPreset(
        projectTuple: ProjectTuple,
        presetKey: string,
        paramUpdated?: (paramKey: string, paramValue: AnyParamValueType) => void
    ) {
        const preset = projectTuple.presets[presetKey];
        if (!preset) throw new Error(`Preset ${presetKey} not found`);
        for (const [paramKey, paramValue] of Object.entries(preset.values)) {
            // Find the relevant config
            const paramConfig = projectTuple.params.find((param) => param.key === paramKey);
            if (!paramConfig) throw new Error(`Param ${paramKey} not found`);

            // Do some basic type checking
            const currentValue = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                paramConfig.key
            )?.value;
            if (typeof paramValue !== typeof currentValue) {
                throw new Error(
                    `Preset value type mismatch for param ${paramKey}: ${typeof paramValue} vs ${typeof currentValue}`
                );
            } else if (Array.isArray(paramValue) !== Array.isArray(currentValue)) {
                throw new Error(
                    `Preset value type mismatch for param ${paramKey}: array vs non-array`
                );
            } else if (Array.isArray(paramValue) && Array.isArray(currentValue)) {
                if (paramValue.length !== currentValue.length) {
                    throw new Error(
                        `Preset value type mismatch for param ${paramKey}: array lengths ${paramValue.length} vs ${currentValue.length}`
                    );
                }
                const arrayTypeMismatch = paramValue.some(
                    (v: number, i: number) => typeof v !== typeof currentValue[i]
                );
                if (arrayTypeMismatch) {
                    throw new Error(
                        `Preset value type mismatch for param ${paramKey}: array element types`
                    );
                }
            }

            // Set value in project, stored state, and displayed values
            const typedValue = paramValue as ParamValueType<typeof paramConfig>; // sorry
            Object.defineProperty(projectTuple.project, paramKey, {
                value: typedValue,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ParamValueProvider.setValue(paramConfig, projectTuple.key, typedValue);
            if (paramUpdated) paramUpdated(paramKey, typedValue);
        }
    }

    /**
     * A convenience function to check if a preset is currently applied to a project. This uses
     * JSON.stringify to compare the values of the preset and the project.
     * @param projectTuple - The project tuple to check.
     * @param presetKey - The key of the preset to check.
     * @returns - True if the preset values are currently applied to the project, false otherwise.
     */
    public static presetIsApplied(projectTuple: ProjectTuple, presetKey: string): boolean {
        const preset = projectTuple.presets[presetKey];
        if (!preset) throw new Error(`Preset ${presetKey} not found`);
        for (const [paramKey, paramValue] of Object.entries(preset.values)) {
            const currentValue = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                paramKey
            )?.value;
            if (JSON.stringify(paramValue) !== JSON.stringify(currentValue)) return false;
        }
        return true;
    }
}
