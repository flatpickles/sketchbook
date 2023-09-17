export interface ProjectConfig {
    title: string;
    date?: Date;
    description?: string;
    defaultPresetName?: string;
    groups: string[];
    presetsAvailable: boolean;
    experimental: boolean;
    paramsApplyDuringInput: boolean;
}

export const ProjectConfigDefaults: ProjectConfig = {
    title: 'Untitled',
    date: undefined,
    description: undefined,
    defaultPresetName: undefined,
    groups: [],
    presetsAvailable: false,
    experimental: false,
    paramsApplyDuringInput: true
};
