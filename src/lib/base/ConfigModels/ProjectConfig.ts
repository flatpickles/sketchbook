export interface ProjectConfig {
    title: string;
    date?: Date;
    description?: string;
    groups: string[];
    experimental: boolean;
    paramsApplyDuringInput: boolean;
    canvasSize?: [number, number];
    pixelRatio?: number;
    twoWaySync: boolean;
    explicitConfig?: boolean;
}

export const ProjectConfigDefaults: ProjectConfig = {
    title: 'Untitled',
    date: undefined,
    description: undefined,
    groups: [],
    experimental: false,
    paramsApplyDuringInput: true,
    canvasSize: undefined,
    pixelRatio: undefined,
    twoWaySync: true,
    explicitConfig: false
};
