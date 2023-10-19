import { NumericArrayParamStyle } from '../ConfigModels/ParamConfigs/NumericArrayParamConfig';
import {
    ParamGuards,
    type AnyParamValueType,
    type ParamValueType
} from '../ConfigModels/ParamTypes';
import ColorConversions from '../Util/ColorConversions';
import ParamValueProvider from './ParamValueProvider';
import { defaultPresetKey, type Preset } from './PresetLoader';
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
     * @param complete - An optional completion callback, passed the keys to params that were
     * changed, and all preset values that were applied (including those that weren't changed).
     */
    public static applyPreset(
        projectTuple: ProjectTuple,
        presetKey: string,
        complete?: (changedKeys: string[], appliedValues: Record<string, AnyParamValueType>) => void
    ) {
        const preset = projectTuple.presets[presetKey];
        if (!preset) throw new Error(`Preset ${presetKey} not found`);
        const changedKeys = [];
        for (const [paramKey, paramValue] of Object.entries(preset.values)) {
            // Find the relevant config
            const paramConfig = projectTuple.params.find((param) => param.key === paramKey);
            if (!paramConfig) throw new Error(`Param ${paramKey} not found`);

            // Don't proceed with parameters that can't have values
            if (!ParamGuards.isConfigTypeWithDefault(paramConfig)) continue;

            // Type value assertion with config type, apologies
            let typedValue = paramValue as ParamValueType<typeof paramConfig>;

            // Allow hex values to be used for color numeric array params
            if (
                ParamGuards.isNumericArrayParamConfig(paramConfig) &&
                typeof typedValue === 'string' &&
                typedValue.match(/^#[0-9a-f]{6}$/i)
            ) {
                if (
                    [NumericArrayParamStyle.ByteColor, NumericArrayParamStyle.UnitColor].includes(
                        paramConfig.style
                    )
                ) {
                    typedValue = ColorConversions.hexToRgb(
                        typedValue,
                        paramConfig.style === NumericArrayParamStyle.UnitColor
                    );
                } else {
                    throw new Error(
                        `Preset value type mismatch for param ${paramKey}: hex strings can only be assigned for numeric arrays with color style.`
                    );
                }
            }

            // Do some basic type checking
            const currentValue = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                paramConfig.key
            )?.value;
            if (typeof typedValue !== typeof currentValue) {
                throw new Error(
                    `Preset value type mismatch for param ${paramKey}: ${typeof typedValue} vs ${typeof currentValue}`
                );
            } else if (Array.isArray(typedValue) !== Array.isArray(currentValue)) {
                throw new Error(
                    `Preset value type mismatch for param ${paramKey}: array vs non-array`
                );
            } else if (Array.isArray(typedValue) && Array.isArray(currentValue)) {
                if (typedValue.length !== currentValue.length) {
                    throw new Error(
                        `Preset value type mismatch for param ${paramKey}: array lengths ${typedValue.length} vs ${currentValue.length}`
                    );
                }
                const arrayTypeMismatch = typedValue.some(
                    (v: number, i: number) => typeof v !== typeof currentValue[i]
                );
                if (arrayTypeMismatch) {
                    throw new Error(
                        `Preset value type mismatch for param ${paramKey}: array element types`
                    );
                }
            }

            // Copy array to avoid aliasing if need be
            typedValue = Array.isArray(typedValue) ? [...typedValue] : typedValue;

            // Set object and stored values if they've changed
            if (JSON.stringify(typedValue) !== JSON.stringify(currentValue)) {
                Object.defineProperty(projectTuple.project, paramKey, {
                    value: typedValue,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                ParamValueProvider.setValue(paramConfig, projectTuple.key, typedValue);
                changedKeys.push(paramKey);
            }
        }

        // Completion callback should update UI accordingly
        if (complete) complete(changedKeys, JSON.parse(JSON.stringify(preset.values)));
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
            const possibleValues: (typeof paramValue)[] = [paramValue];

            // Allow hex values to be used for three-element numeric array params
            // More permissive than applyPreset, because we don't need user-legible errors here
            if (
                Array.isArray(currentValue) &&
                currentValue.length === 3 &&
                typeof paramValue === 'string' &&
                paramValue.match(/^#[0-9a-f]{6}$/i)
            ) {
                possibleValues.push(ColorConversions.hexToRgb(paramValue, false));
                possibleValues.push(ColorConversions.hexToRgb(paramValue, true));
            }

            // Check if any of the possible values match the current value
            let anyMatch = false;
            for (const possibleValue of possibleValues) {
                if (JSON.stringify(possibleValue) === JSON.stringify(currentValue)) {
                    anyMatch = true;
                    break;
                }
            }
            if (!anyMatch) return false;
        }
        return true;
    }

    /**
     * Export the current project parameter values in a preset JSON file. These files can be added
     * directly to a project's `presets` directory and used as bundled presets.
     * @param projectTuple - The project tuple from which to draw the current parameter values.
     * @param newPresetName - The name to give the preset. File name/key is also derived from this.
     */
    public static exportPresetFile(projectTuple: ProjectTuple, newPresetName: string) {
        // Create a preset object from current project state
        const presetObject: Preset = {
            title: newPresetName,
            key: newPresetName.replace(/\s/g, ''),
            values: {}
        };
        for (const paramConfig of projectTuple.params) {
            if (!ParamGuards.isConfigTypeWithDefault(paramConfig)) continue;
            const currentValue = Object.getOwnPropertyDescriptor(
                projectTuple.project,
                paramConfig.key
            )?.value;
            presetObject.values[paramConfig.key] = currentValue;
        }

        // Save a JSON file with the preset values
        const presetString = JSON.stringify(presetObject, null, 4);
        const presetBlob = new Blob([presetString], { type: 'application/json' });
        const presetUrl = URL.createObjectURL(presetBlob);
        const presetLink = document.createElement('a');
        presetLink.href = presetUrl;
        presetLink.download = `${presetObject.key}.json`;
        presetLink.click();
    }
}
