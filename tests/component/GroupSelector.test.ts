import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import { type ProjectConfig, ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import GroupSelector from '$lib/components/GroupSelector.svelte';
import { SortOrder } from '$lib/base/Util/ConfigTypes';

function projectWithGroups(groups: string[], date: number): ProjectConfig {
    const props = {} as ProjectConfig;
    Object.assign(props, ProjectConfigDefaults);
    props.groups = groups;
    props.date = new Date(date);
    return props;
}

describe('GroupSelector', () => {
    afterEach(cleanup);

    it('renders and dedupes groups', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['banana', 'dog'], 0),
            projectWithGroups(['dog', 'apple'], 0)
        ];
        render(GroupSelector, {
            projects: projects
        });

        const groupList = screen.getByTestId('group-list');
        expect(groupList).toBeDefined();

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems.length).toBe(4); // "all" + 3 groups
    });

    it('orders groups correctly (alphabetical)', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['banana', 'dog'], 0),
            projectWithGroups(['dog', 'apple'], 0)
        ];
        render(GroupSelector, {
            projects: projects,
            sorting: SortOrder.Alphabetical
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].textContent).toBe('All');
        expect(groupItems[1].textContent).toContain('apple');
        expect(groupItems[2].textContent).toContain('banana');
        expect(groupItems[3].textContent).toContain('dog');
    });

    it('orders groups correctly (chronological)', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['apple'], 0),
            projectWithGroups(['banana'], 200),
            projectWithGroups(['dog'], 100)
        ];
        render(GroupSelector, {
            projects: projects,
            sorting: SortOrder.Chronological
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].textContent).toBe('All');
        expect(groupItems[1].textContent).toContain('apple');
        expect(groupItems[2].textContent).toContain('dog');
        expect(groupItems[3].textContent).toContain('banana');
    });

    it('orders groups correctly (reverse-chron)', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['apple'], 0),
            projectWithGroups(['banana'], 200),
            projectWithGroups(['dog'], 100)
        ];
        render(GroupSelector, {
            projects: projects,
            sorting: SortOrder.ReverseChronological
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].textContent).toBe('All');
        expect(groupItems[1].textContent).toContain('banana');
        expect(groupItems[2].textContent).toContain('dog');
        expect(groupItems[3].textContent).toContain('apple');
    });

    it('initializes with selected group if provided', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['banana', 'dog'], 0),
            projectWithGroups(['dog', 'apple'], 0)
        ];
        const { component } = render(GroupSelector, {
            projects: projects,
            selectedGroup: 'banana'
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].classList.contains('selected')).toBe(false);
        expect(groupItems[1].classList.contains('selected')).toBe(false);
        expect(groupItems[2].classList.contains('selected')).toBe(true);
        expect(groupItems[3].classList.contains('selected')).toBe(false);
        expect(component.selectedGroup).toBe('banana');
    });

    it('selects All by default; updates selected group with clicks', async () => {
        const projects: ProjectConfig[] = [
            projectWithGroups(['banana', 'dog'], 0),
            projectWithGroups(['dog', 'apple'], 0)
        ];
        const { component } = render(GroupSelector, {
            projects: projects
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].classList.contains('selected')).toBe(true);
        expect(groupItems[1].classList.contains('selected')).toBe(false);
        expect(groupItems[2].classList.contains('selected')).toBe(false);
        expect(groupItems[3].classList.contains('selected')).toBe(false);
        expect(component.selectedGroup).toBeUndefined();

        await fireEvent.click(groupItems[1]);
        expect(groupItems[0].classList.contains('selected')).toBe(false);
        expect(groupItems[1].classList.contains('selected')).toBe(true);
        expect(groupItems[2].classList.contains('selected')).toBe(false);
        expect(groupItems[3].classList.contains('selected')).toBe(false);
        expect(component.selectedGroup).toBe('apple');
    });

    it('does not render with no groups', async () => {
        const projects: ProjectConfig[] = [projectWithGroups([], 0), projectWithGroups([], 0)];
        render(GroupSelector, {
            projects: projects
        });

        expect(() => {
            screen.getByTestId('group-list');
        }).toThrow();

        expect(() => {
            screen.getByTestId('group-item');
        }).toThrow();
    });
});
