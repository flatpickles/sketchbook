export enum ProjectSortType {
    Date = 'date',
    Alphabetical = 'alphabetical'
}

export interface SketchbookConfig {
    title: string;
    subtitle: string | undefined;
    description: string | undefined;
    footer: string | undefined;
    sorting: ProjectSortType;
    // todo: group sorting? (date, alphabetical, explicit)
    defaultGroup: string | undefined;
    storeParamValues: boolean;
    storeProjectSelection: boolean;
}

export const SketchbookConfigDefaults: SketchbookConfig = {
    title: 'Sketchbook',
    subtitle: undefined,
    description: 'A collection of generative art projects.',
    footer: undefined,
    sorting: ProjectSortType.Date,
    defaultGroup: undefined,
    storeParamValues: true,
    storeProjectSelection: true
};
