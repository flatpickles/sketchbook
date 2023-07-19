import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import { type ProjectProperties, ProjectPropertiesDefaults } from '$lib/base/ProjectConfig';
import GroupSelector from '$lib/components/GroupSelector.svelte';

function projectWithGroups(groups: string[]): ProjectProperties {
    const props = {} as ProjectProperties;
    Object.assign(props, ProjectPropertiesDefaults);
    props.groups = groups;
    return props;
}

describe('GroupSelector', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders and dedupes groups', async () => {
        const projects: ProjectProperties[] = [
            projectWithGroups(['banana', 'dog']),
            projectWithGroups(['dog', 'apple'])
        ];
        render(GroupSelector, {
            projects: projects
        });

        const groupList = screen.getByTestId('group-list');
        expect(groupList).toBeDefined();

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems.length).toBe(4); // "all" + 3 groups
    });

    it('orders groups correctly', async () => {
        const projects: ProjectProperties[] = [
            projectWithGroups(['banana', 'dog']),
            projectWithGroups(['dog', 'apple'])
        ];
        render(GroupSelector, {
            projects: projects
        });

        const groupItems = screen.getAllByTestId('group-item');
        expect(groupItems[0].textContent).toBe('All');
        expect(groupItems[1].textContent).toContain('apple');
        expect(groupItems[2].textContent).toContain('banana');
        expect(groupItems[3].textContent).toContain('dog');
    });

    it('initializes with selected group if provided', async () => {
        const projects: ProjectProperties[] = [
            projectWithGroups(['banana', 'dog']),
            projectWithGroups(['dog', 'apple'])
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
        const projects: ProjectProperties[] = [
            projectWithGroups(['banana', 'dog']),
            projectWithGroups(['dog', 'apple'])
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
        const projects: ProjectProperties[] = [projectWithGroups([]), projectWithGroups([])];
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
