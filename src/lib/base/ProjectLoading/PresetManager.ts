import { defaultPresetKey } from './PresetLoader';

export default class PresetManager {
    public static getSelectedPresetKey(projectKey: string): string {
        return localStorage.getItem(`selectedPreset_${projectKey}`) ?? defaultPresetKey;
    }

    public static setSelectedPresetKey(projectKey: string, presetKey: string) {
        localStorage.setItem(`selectedPreset_${projectKey}`, presetKey);
    }
}
