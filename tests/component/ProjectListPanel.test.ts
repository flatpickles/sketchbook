import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig';
import { type SketchbookConfig, ProjectSortType } from '$lib/base/ConfigLoader';
import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

describe('ProjectListPanel rendering', () => {
    afterEach(() => {
        cleanup();
    });

    it('uses the sketchbookConfig values', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            description: 'Test Description',
            sorting: ProjectSortType.Alphabetical,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: {},
            selectedProjectKey: 'test'
        });

        const title = screen.getByTestId('header-title');
        expect(title.textContent).toBe(sketchbookConfig.title);
        const subtitle = screen.getByTestId('header-subtitle');
        expect(subtitle.textContent).toBe(sketchbookConfig.subtitle);
        const description = screen.getByTestId('header-description');
        expect(description.textContent).toBe(sketchbookConfig.description);
    });

    it('does not render subtitle or description if not provided', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: undefined,
            description: undefined,
            sorting: ProjectSortType.Alphabetical,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: {},
            selectedProjectKey: 'test'
        });

        const title = screen.queryByTestId('header-title');
        expect(title).toBeDefined();
        const subtitle = screen.queryByTestId('header-subtitle');
        expect(subtitle).toBeNull();
        const description = screen.queryByTestId('header-description');
        expect(description).toBeNull();
    });

    it('renders projects alphabetically', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: undefined,
            description: undefined,
            sorting: ProjectSortType.Alphabetical,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01'
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03'
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2021-01-02'
            })
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: projects,
            selectedProjectKey: 'banana'
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(3);
        expect(listItems[0].textContent).toContain('Apple');
        expect(listItems[1].textContent).toContain('Banana');
        expect(listItems[2].textContent).toContain('Carrot');
    });

    it('renders projects by date', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: undefined,
            description: undefined,
            sorting: ProjectSortType.Date,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01'
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03'
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02'
            })
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: projects,
            selectedProjectKey: 'banana'
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(3);
        expect(listItems[0].textContent).toContain('Carrot');
        expect(listItems[1].textContent).toContain('Apple');
        expect(listItems[2].textContent).toContain('Banana');
    });

    it('selects the proper project via selectedProjectKey', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: undefined,
            description: undefined,
            sorting: ProjectSortType.Date,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01'
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03'
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02'
            })
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: projects,
            selectedProjectKey: 'apple'
        });

        const appleItem = screen.getByText('Apple').parentElement;
        expect(appleItem?.classList.contains('selected')).toBe(true);
    });
});

describe('ProjectListPanel interaction', () => {
    let renderedComponent: ProjectListPanel;
    beforeAll(() => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: undefined,
            description: undefined,
            sorting: ProjectSortType.Date,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01',
                groups: ['fruit']
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03',
                groups: ['fruit', 'technology']
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02',
                groups: ['vegetable']
            })
        };
        const { component } = render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: projects,
            selectedProjectKey: 'banana'
        });
        renderedComponent = component;
    });

    it('selects projects when clicked', async () => {
        return;
        const listItems = screen.getAllByTestId('project-list-item');
        fireEvent.click(listItems[0]);
        // renderedComponent.
        fireEvent.click(listItems[1]);
        expect(window.location.pathname).toBe('/apple');
        fireEvent.click(listItems[2]);
        expect(window.location.pathname).toBe('/carrot');
    });

    it('filters projects when group is clicked', async () => {
        // todo
    });
});
