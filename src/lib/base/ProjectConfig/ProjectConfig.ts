export interface ProjectConfig {
    title: string;
    date?: Date;
    description?: string;
    defaultPresetName?: string;
    groups?: string[];
    liveUpdates: boolean;
    presetsAvailable: boolean;
    experimental: boolean;
}

export const ProjectConfigDefaults: ProjectConfig = {
    title: 'Untitled',
    date: undefined,
    description: undefined,
    defaultPresetName: undefined,
    groups: [],
    liveUpdates: true,
    presetsAvailable: false,
    experimental: false
};
