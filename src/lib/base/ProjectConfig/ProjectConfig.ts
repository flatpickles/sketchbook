export interface ProjectConfig {
    title: string;
    date?: Date;
    description?: string;
    defaultPresetName?: string;
    liveUpdates?: boolean;
    groups?: string[];
    experimental?: boolean;
}

export const ProjectConfigDefaults: ProjectConfig = {
    title: 'Untitled',
    date: undefined,
    description: undefined,
    defaultPresetName: undefined,
    liveUpdates: true,
    groups: [],
    experimental: false
};
