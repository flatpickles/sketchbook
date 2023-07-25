import { importSketchbookConfigFile } from './FileProviders';
import { type SketchbookConfig, SketchbookConfigDefaults } from './SketchbookConfig';

type SketchbookConfigModule = {
    default: new () => Record<string, unknown>;
};

export default class SketchbookConfigLoader {
    public static async loadConfig(): Promise<SketchbookConfig> {
        // Create new config object and assign defaults
        const sketchbookConfig = {} as SketchbookConfig;
        Object.assign(sketchbookConfig, SketchbookConfigDefaults);

        // Import config file
        const moduleFactory = importSketchbookConfigFile();
        if (!moduleFactory) return sketchbookConfig;
        const module = (await moduleFactory()) as SketchbookConfigModule;
        const configData = module.default;

        // Assign properties from data
        const configKeys = Object.getOwnPropertyNames(configData);
        for (const key of configKeys) {
            if (Object.getOwnPropertyNames(sketchbookConfig).indexOf(key) < 0) {
                throw new Error(`Unsupported Sketchbook config field: ${key}`);
            }
        }
        Object.assign(sketchbookConfig, configData);

        // Return the config object
        return sketchbookConfig;
    }
}
