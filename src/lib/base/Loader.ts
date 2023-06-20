import Project from './Project';

interface ProjectData {
    title: string;
    date: Date;
    key: string;
}

export class SketchbookLoader {
    public projectList: ProjectData[] = [];

    public constructor() {
        this.#loadProjectList();
    }

    #loadProjectList(): void {
        this.projectList = [];
    }

    public async loadProject(): Promise<Project> {
        const canvas = document.createElement('canvas');
        const project = new Project(canvas);
        return project;
    }
}

export const Loader = new SketchbookLoader();
