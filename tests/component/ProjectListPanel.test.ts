import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { ProjectConfigFactory } from '$lib/base/ProjectConfig/ProjectConfigFactory';
import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';
import { type SketchbookConfig, ProjectSortType } from '$lib/base/FileLoading/SketchbookConfig';

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
                groups: ['Fruit']
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03',
                groups: ['Fruit', 'Technology']
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02',
                groups: ['Vegetable']
            })
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: projects,
            selectedProjectKey: 'Banana'
        });
    });

    it('filters projects when group or all is clicked', async () => {
        // Technology
        const techItem = screen.getByText('Technology');
        await fireEvent.click(techItem);
        let listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(1);

        // Fruit
        const fruitItem = screen.getByText('Fruit');
        await fireEvent.click(fruitItem);
        listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(2);

        // Veggies
        const veggiesItem = screen.getByText('Vegetable');
        await fireEvent.click(veggiesItem);
        listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(1);

        // All
        const allItem = screen.getByText('All');
        await fireEvent.click(allItem);
        listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(3);
    });
});
