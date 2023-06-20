import type ParamModel from './ParamModel';
import type Project from './Project';

/**
 * ProjectMetadata is the configuration data for a project.
 */
export interface ProjectMetadata {
    key: string;
    title: string;
    date: Date;
    description: string;
    defaultPresetName: string;
    live: boolean;
    groups: string[];
    experimental: boolean;
}

/**
 * ProjectModel is the internal representation of a project.
 * This is distinct from the Project class, which is meant to be a simple
 * superclass for all projects in src/art. ProjectModel is meant to be
 * used by the UI layer; models are built by the Loader, leveraging
 * project configuration data.
 */
export default class ProjectModel {
    public baseProject: Project;
    public metadata: ProjectMetadata;
    public params: ParamModel[] = [];

    public constructor(baseProject: Project, metadata: ProjectMetadata) {
        this.baseProject = baseProject;
        this.metadata = metadata;
    }
}
