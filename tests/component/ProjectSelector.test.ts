import { render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import ProjectSelector from '$lib/components/ProjectListPanel/ProjectSelector.svelte';
import { ProjectConfigDefaults } from '$lib/base/ConfigModels/ProjectConfig';
import { settingsStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';

const testProjects = {
    'project1': {
        ...ProjectConfigDefaults,
        title: 'Project 1'
    },
    'project2': {
        ...ProjectConfigDefaults,
        title: 'Project 2'
    },
    'project3': {
        ...ProjectConfigDefaults,
        title: 'Project 3'
    },
    'experimentalProject': {
        ...ProjectConfigDefaults,
        title: 'Experimental Project',
        experimental: true
    }
};

function renderTestProjects(selectedProjectKey = 'project1') {
    settingsStore.set({
        ...get(settingsStore),
        showExperiments: false
    });

    const { component } = render(ProjectSelector, {
        projects: testProjects,
        selectedProjectKey: selectedProjectKey
    });
    return component;
}

describe('ProjectSelector rendering', () => {
    afterEach(cleanup);

    it('renders projects alphabetically', async () => {
        renderTestProjects();

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project1');

        const projectOptions = screen.getAllByTestId('project-option');
        expect(projectOptions.length).toBe(3);
        expect(projectOptions[0].textContent).toContain('Project 1');
        expect(projectOptions[1].textContent).toContain('Project 2');
        expect(projectOptions[2].textContent).toContain('Project 3');
    });

    it('renders with selected project', async () => {
        renderTestProjects('project2');

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project2');
    });

    it('changes selection with selectedProjectKey prop', async () => {
        const component = renderTestProjects();

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project1');
        component.selectedProjectKey = 'project2';
        expect(projectSelect.value).toBe('project2');
    });

    it('properly links left and right buttons', async () => {
        renderTestProjects('project2');

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project2');

        const leftButton = screen.getByTestId('previous-project');
        expect(leftButton).toBeDefined();
        expect(leftButton.classList.contains('disabled')).toBe(false);
        expect(leftButton.parentElement?.getAttribute('href')).toBe('/project1');

        const rightButton = screen.getByTestId('next-project');
        expect(rightButton).toBeDefined();
        expect(rightButton.classList.contains('disabled')).toBe(false);
        expect(rightButton.parentElement?.getAttribute('href')).toBe('/project3');
    });

    it('disables left button when first project is selected', async () => {
        const component = renderTestProjects();

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project1');

        const leftButton = screen.getByTestId('previous-project');
        expect(leftButton).toBeDefined();
        expect(leftButton.classList.contains('disabled')).toBe(true);

        component.selectedProjectKey = 'project2';
        const newLeft = screen.getByTestId('previous-project');
        expect(newLeft.classList.contains('disabled')).toBe(false);
    });

    it('disables right button when last project is selected', async () => {
        const component = renderTestProjects();

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('project1');

        const rightButton = screen.getByTestId('next-project');
        expect(rightButton).toBeDefined();
        expect(rightButton.classList.contains('disabled')).toBe(false);

        component.selectedProjectKey = 'project3';
        const newRight = screen.getByTestId('next-project');
        expect(newRight.classList.contains('disabled')).toBe(true);
    });

    it('shows "No Projects" when no projects are available', async () => {
        const { component } = render(ProjectSelector, {
            projects: {},
            selectedProjectKey: 'project1'
        });

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('');

        const projectOptions = screen.queryAllByTestId('project-option');
        expect(projectOptions.length).toBe(1);
        expect(projectOptions[0].textContent).toContain('No Projects');

        component.projects = testProjects;
        expect(projectSelect.value).toBe('project1');
    });

    it('shows "Select Project" when projects is not found', async () => {
        render(ProjectSelector, {
            projects: testProjects,
            selectedProjectKey: 'project7'
        });

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('');

        const projectOptions = screen.queryAllByTestId('project-option');
        expect(projectOptions.length).toBe(4);
        expect(projectOptions[0].textContent).toContain('Select Project');
    });

    it('shows the project name even if it is experimental', async () => {
        render(ProjectSelector, {
            projects: testProjects,
            selectedProjectKey: 'experimentalProject'
        });

        const projectSelect = screen.getByTestId('project-select') as HTMLSelectElement;
        expect(projectSelect).toBeDefined();
        expect(projectSelect.value).toBe('experimentalProject');

        const projectOptions = screen.queryAllByTestId('project-option');
        expect(projectOptions.length).toBe(4);
        expect(projectOptions[0].textContent).toContain('Experimental Project');
    });
});
