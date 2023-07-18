import { importSketchbookConfigFile } from './FileProviders';

export enum SortType {
    Date = 'date',
    Alphabetical = 'alphabetical'
}

export interface SketchbookConfig {
    title: string;
    subtitle: string | undefined;
    description: string | undefined;
    sorting: SortType;
    defaultGroup: string;
    storeParamValues: boolean;
    storeProjectSelection: boolean;
}

export const SketchbookConfigDefaults: SketchbookConfig = {
    title: 'Sketchbook',
    subtitle: undefined,
    description: 'A collection of generative art projects.',
    sorting: SortType.Date,
    defaultGroup: 'Uncategorized',
    storeParamValues: true,
    storeProjectSelection: true
};

type ConfigModule = {
    default: new () => Record<string, unknown>;
};

export default class ConfigLoader {
    public static async loadSketchbookConfig(): Promise<SketchbookConfig> {
        // Create new config object and assign defaults
        const sketchbookConfig = {} as SketchbookConfig;
        Object.assign(sketchbookConfig, SketchbookConfigDefaults);

        // Import config file
        const moduleFactory = importSketchbookConfigFile();
        if (!moduleFactory) return sketchbookConfig;
        const module = (await moduleFactory()) as ConfigModule;
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
