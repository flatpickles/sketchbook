import type { ProjectConfig } from '../ConfigModels/ProjectConfig';

export enum SortOrder {
    Alphabetical = 'alphabetical',
    Chronological = 'chronological',
    ReverseChronological = 'reverse-chronological'
}

export default class ProjectPresentation {
    public static presentedKeys(
        projects: Record<string, ProjectConfig>,
        sorting: SortOrder,
        showExperiments: boolean,
        selectedGroup?: string
    ): string[] {
        const sortedKeys = Object.keys(projects).sort((a, b) => {
            const projectA = projects[a];
            const projectB = projects[b];
            const timeA = projectA.date ? projectA.date.getTime() : Date.now();
            const timeB = projectB.date ? projectB.date.getTime() : Date.now();
            switch (sorting) {
                case SortOrder.Alphabetical:
                    return projectA.title.localeCompare(projectB.title);
                case SortOrder.Chronological:
                    return timeA - timeB;
                case SortOrder.ReverseChronological:
                    return timeB - timeA;
                default:
                    throw new Error(`Unknown sort order: ${sorting}`);
            }
        });

        const visibleKeys = sortedKeys.filter((key) => {
            const project = projects[key];
            if (!project) return false;
            if (project.experimental && !showExperiments) return false;
            if (selectedGroup === undefined) return true;
            if (!project.groups.includes(selectedGroup)) return false;
            return true;
        });

        return visibleKeys;
    }
}
