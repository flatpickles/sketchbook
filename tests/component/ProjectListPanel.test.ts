import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import {
    type ProjectProperties,
    ProjectPropertiesDefaults,
    ProjectConfigFactory
} from '$lib/base/ProjectConfig';
import { type SketchbookConfig, SortType } from '$lib/base/ConfigLoader';
import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

describe('ProjectListPanel', () => {
    afterEach(() => {
        cleanup();
    });

    it('uses the sketchbookConfig values', async () => {
        const sketchbookConfig: SketchbookConfig = {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            description: 'Test Description',
            sorting: SortType.Alphabetical,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: {}
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
            sorting: SortType.Alphabetical,
            defaultGroup: undefined,
            storeParamValues: false,
            storeProjectSelection: false
        };
        render(ProjectListPanel, {
            sketchbookConfig: sketchbookConfig,
            projects: {}
        });

        const title = screen.queryByTestId('header-title');
        expect(title).toBeDefined();
        const subtitle = screen.queryByTestId('header-subtitle');
        expect(subtitle).toBeNull();
        const description = screen.queryByTestId('header-description');
        expect(description).toBeNull();
    });

    it('renders projects alphabetically', async () => {
        // todo
        // (use ProjectConfigFactory to create project configs as needed)
    });

    it('renders projects by date', async () => {
        // todo
    });

    it('navigates to projects when clicked', async () => {
        // todo
    });

    it('filters projects when group is clicked', async () => {
        // todo
    });
});
