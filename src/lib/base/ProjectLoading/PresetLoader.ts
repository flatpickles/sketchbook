import type { AnyParamValueType } from '../ConfigModels/ParamTypes';
import { importProjectPresetFiles } from './ImportProviders';
import { dev } from '$app/environment';

export const defaultPresetKey = 'defaults';

export type Preset = {
    title: string;
    key: string;
    values: Record<string, AnyParamValueType>;
};

export type PresetMap = Record<string, Preset>;

export default class PresetLoader {
    public static async loadPresets(projectKey: string): Promise<PresetMap> {
        const loadedPresets: PresetMap = {};
        const imports = importProjectPresetFiles();

        for (const [path, importFunction] of Object.entries(imports)) {
            // Continue onward if this preset is not for the current project
            const pathComponents = path.split('/');
            const pathProjectKey = pathComponents[pathComponents.length - 3];
            if (pathProjectKey !== projectKey) continue;

            // Load the preset, if possible
            const presetKey = pathComponents[pathComponents.length - 1].replace('.json', '');
            const preset = (await importFunction()) as string;
            try {
                const presetData: Record<string, unknown> = JSON.parse(preset);
                if (presetData.title !== undefined && typeof presetData.title !== 'string') {
                    throw new Error('Preset "title" must be a string if specified');
                }
                if (presetData.values !== undefined && typeof presetData.values !== 'object') {
                    throw new Error('Preset "values" must be an object if specified');
                }
                loadedPresets[presetKey] = {
                    title: presetData.title ?? presetKey,
                    key: presetKey,
                    values: (presetData.values as Record<string, AnyParamValueType>) ?? {}
                };
            } catch (e) {
                // Don't throw an error; we may still be able to use other preset files
                if (dev && import.meta.env.MODE !== 'test')
                    console.error(`Error parsing ${presetKey}.json: ${e}`);
                continue;
            }
        }

        return loadedPresets;
    }
}
