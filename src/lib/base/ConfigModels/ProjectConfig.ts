export interface ProjectConfig {
    title: string;
    date: Date | undefined;
    description: string | undefined;
    groups: string[];
    experimental: boolean;
    paramsApplyDuringInput: boolean;
    canvasSize: [number, number] | undefined;
    pixelRatio: number | undefined;
    twoWaySync: boolean;
    explicitConfig: boolean;
    staticMode: boolean;
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
    explicitConfig: false,
    staticMode: false
};
