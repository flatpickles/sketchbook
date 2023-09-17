import ProjectPresentation, { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
import { ProjectConfigDefaults, type ProjectConfig } from '$lib/base/ConfigModels/ProjectConfig';
import { describe, expect, it } from 'vitest';

const projects: Record<string, ProjectConfig> = {
    'project-1': {
        ...ProjectConfigDefaults,
        title: 'Project 1',
        date: new Date('2021-01-01'),
        experimental: false,
        groups: ['group-1', 'group-2']
    },
    'project-2': {
        ...ProjectConfigDefaults,
        title: 'Project 2',
        date: new Date('2021-01-04'),
        experimental: true,
        groups: ['group-1']
    },
    'project-3': {
        ...ProjectConfigDefaults,
        title: 'Project 3',
        date: new Date('2021-01-02'),
        experimental: false,
        groups: ['group-2']
    },
    'project-4': {
        ...ProjectConfigDefaults,
        title: 'Project 4',
        date: new Date('2021-01-03'),
        experimental: true,
        groups: ['group-1', 'group-2']
    }
};

describe('ProjectPresentation', () => {
    it('should sort projects alphabetically', () => {
        const keys = ProjectPresentation.presentedKeys(projects, SortOrder.Alphabetical, true);
        expect(keys).toEqual(['project-1', 'project-2', 'project-3', 'project-4']);
    });

    it('should sort projects chronologically', () => {
        const keys = ProjectPresentation.presentedKeys(projects, SortOrder.Chronological, true);
        expect(keys).toEqual(['project-1', 'project-3', 'project-4', 'project-2']);
    });

    it('should sort projects reverse-chronologically', () => {
        const keys = ProjectPresentation.presentedKeys(
            projects,
            SortOrder.ReverseChronological,
            true
        );
        expect(keys).toEqual(['project-2', 'project-4', 'project-3', 'project-1']);
    });

    it('should filter out experimental projects', () => {
        const keys = ProjectPresentation.presentedKeys(projects, SortOrder.Alphabetical, false);
        expect(keys).toEqual(['project-1', 'project-3']);
    });

    it('should filter out projects not in the selected group', () => {
        const keys = ProjectPresentation.presentedKeys(
            projects,
            SortOrder.Alphabetical,
            true,
            'group-1'
        );
        expect(keys).toEqual(['project-1', 'project-2', 'project-4']);
    });

    it('should filter out experimental projects not in the selected group', () => {
        const keys = ProjectPresentation.presentedKeys(
            projects,
            SortOrder.Alphabetical,
            false,
            'group-1'
        );
        expect(keys).toEqual(['project-1']);
    });
});
