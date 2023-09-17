import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, afterEach, beforeAll } from 'vitest';
import { ProjectConfigFactory } from '$lib/base/ProjectLoading/ProjectConfigFactory';
import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

import { content } from '../../src/config/content';
import { config } from '../../src/config/config';
import { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';

describe('ProjectListPanel rendering', () => {
    afterEach(cleanup);

    it('uses the sketchbookConfig values', async () => {
        vi.spyOn(content, 'title', 'get').mockReturnValue('test title');
        vi.spyOn(content, 'subtitle', 'get').mockReturnValue('test subtitle');
        vi.spyOn(content, 'description', 'get').mockReturnValue('test description');
        vi.spyOn(content, 'footer', 'get').mockReturnValue('test footer');

        render(ProjectListPanel, {
            projects: {},
            selectedProjectKey: 'test',
            headerButtonIcon: 'fa-close'
        });

        const title = screen.getByTestId('header-title');
        expect(title.textContent).toBe('test title');
        const subtitle = screen.getByTestId('header-subtitle');
        expect(subtitle.textContent).toBe('test subtitle');

        const description = screen.getByTestId('header-description');
        expect(description.textContent).toBe('test description');
        const footer = screen.getByTestId('footer-text');
        expect(footer.textContent).toBe('test footer');

        const headerButton = screen.getByTestId('right-header-button');
        expect(headerButton.firstElementChild?.classList.contains('fa-close')).toBe(true);
    });

    it('does not render subtitle, description, or button if not provided', async () => {
        vi.spyOn(content, 'title', 'get').mockReturnValue('test title');
        vi.spyOn(content, 'subtitle', 'get').mockReturnValue('');
        vi.spyOn(content, 'description', 'get').mockReturnValue('');

        render(ProjectListPanel, {
            projects: {},
            selectedProjectKey: 'test',
            headerButtonIcon: undefined
        });

        const title = screen.queryByTestId('header-title');
        expect(title).toBeDefined();
        const subtitle = screen.queryByTestId('header-subtitle');
        expect(subtitle).toBeNull();
        const description = screen.queryByTestId('header-description');
        expect(description).toBeNull();
        const button = screen.queryByTestId('right-header-button');
        expect(button).toBeNull();
    });

    it('renders projects alphabetically', async () => {
        vi.spyOn(config, 'projectSortOrder', 'get').mockReturnValue(SortOrder.Alphabetical);

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
            }),
            dateless: ProjectConfigFactory.propsFrom({
                title: 'Dateless'
            })
        };
        render(ProjectListPanel, {
            projects: projects,
            selectedProjectKey: 'banana',
            headerButtonIcon: undefined
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(4);
        expect(listItems[0].textContent).toContain('Apple');
        expect(listItems[1].textContent).toContain('Banana');
        expect(listItems[2].textContent).toContain('Carrot');
        expect(listItems[3].textContent).toContain('Dateless');
    });

    it('renders projects reverse chronologically', async () => {
        vi.spyOn(config, 'projectSortOrder', 'get').mockReturnValue(SortOrder.ReverseChronological);

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
            }),
            dateless: ProjectConfigFactory.propsFrom({
                title: 'Dateless'
            })
        };
        render(ProjectListPanel, {
            projects: projects,
            selectedProjectKey: 'banana',
            headerButtonIcon: undefined
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(4);
        expect(listItems[0].textContent).toContain('Dateless');
        expect(listItems[1].textContent).toContain('Carrot');
        expect(listItems[2].textContent).toContain('Apple');
        expect(listItems[3].textContent).toContain('Banana');
    });

    it('renders projects chronologically', async () => {
        vi.spyOn(config, 'projectSortOrder', 'get').mockReturnValue(SortOrder.Chronological);

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
            }),
            dateless: ProjectConfigFactory.propsFrom({
                title: 'Dateless'
            })
        };
        render(ProjectListPanel, {
            projects: projects,
            selectedProjectKey: 'banana',
            headerButtonIcon: undefined
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(4);
        expect(listItems[0].textContent).toContain('Banana');
        expect(listItems[1].textContent).toContain('Apple');
        expect(listItems[2].textContent).toContain('Carrot');
        expect(listItems[3].textContent).toContain('Dateless');
    });

    it('selects the proper project via selectedProjectKey', async () => {
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
            projects: projects,
            selectedProjectKey: 'apple',
            headerButtonIcon: undefined
        });

        const appleItem = screen.getByText('Apple');
        expect(appleItem?.classList.contains('selected')).toBe(true);
    });
});

describe('ProjectListPanel interaction', () => {
    afterEach(cleanup);

    beforeAll(() => {
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
            projects: projects,
            selectedProjectKey: 'Banana',
            headerButtonIcon: undefined
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

    it('shows experimental projects when showExperiments is true', async () => {
        vi.spyOn(config, 'showExperiments', 'get').mockReturnValue(true);

        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01',
                experimental: false
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03',
                experimental: true
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02',
                experimental: false
            })
        };
        render(ProjectListPanel, {
            projects: projects,
            selectedProjectKey: 'banana',
            headerButtonIcon: undefined
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(3);
        const experimentalIcon = screen.getAllByTestId('experimental-icon');
        expect(experimentalIcon.length).toBe(1);
    });

    it('hides experimental projects when showExperiments is false', async () => {
        vi.spyOn(config, 'showExperiments', 'get').mockReturnValue(false);

        const projects = {
            banana: ProjectConfigFactory.propsFrom({
                title: 'Banana',
                date: '2021-01-01',
                experimental: false
            }),
            apple: ProjectConfigFactory.propsFrom({
                title: 'Apple',
                date: '2021-01-03',
                experimental: true
            }),
            carrot: ProjectConfigFactory.propsFrom({
                title: 'Carrot',
                date: '2022-01-02',
                experimental: false
            })
        };
        render(ProjectListPanel, {
            projects: projects,
            selectedProjectKey: 'banana',
            headerButtonIcon: undefined
        });

        const listItems = screen.getAllByTestId('project-list-item');
        expect(listItems.length).toBe(2);
        expect(() => screen.getAllByTestId('experimental-icon')).toThrow();
    });
});
