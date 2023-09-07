import { render, fireEvent, screen, cleanup, waitFor, within } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import MainView from '$lib/components/MainView.svelte';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import Project from '$lib/base/Project/Project';
import { stateStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';
import { PanelState } from '$lib/base/Util/PanelState';

const configs = {
    Untitled: ProjectConfigDefaults
};
const projectTuple = {
    key: 'Untitled',
    project: new Project(),
    props: ProjectConfigDefaults,
    params: []
};

describe('MainView layout', () => {
    afterEach(cleanup);

    it('renders main wrapper', async () => {
        render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        const wrapper = screen.getByTestId('main-wrapper');
        expect(wrapper).toBeDefined();
    });
});

describe('Settings', () => {
    afterEach(cleanup);
    it('shows and hides the settings panel', async () => {
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // No settings overlay to start
        expect(get(stateStore).settingsPresented).toBe(false);
        expect(() => getByTestId('settings-overlay')).toThrow();

        // Click the settings button
        const settingsButton = getByTestId('right-footer-button');
        fireEvent.click(settingsButton);
        await waitFor(() => expect(get(stateStore).settingsPresented).toBe(true));

        // Check that the settings panel is displayed (contents tested elsewhere)
        const settingsOverlay = getByTestId('settings-overlay');
        expect(settingsOverlay).toBeDefined();

        // Click the close button & check that it closes the settings panel
        within(settingsOverlay).getByTestId('right-header-button').click();
        await waitFor(() => expect(get(stateStore).settingsPresented).toBe(false));
        // It seems like settings-overlay is still in the DOM; this is only when using
        // Svelte's transition:fade - a framework bug maybe
    });
});

describe('PanelState.Visible <-> PanelState.Hidden', () => {
    afterEach(cleanup);

    it('starting with PanelState.Hidden, hides both panels on first render', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.Hidden,
            projectDetailState: PanelState.Hidden
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        expect(leftPanelWrapper).toBeDefined();
        expect(leftPanelWrapper.classList.contains('closed')).toBe(true);

        // Find & validate right panel wrapper
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(rightPanelWrapper).toBeDefined();
        expect(rightPanelWrapper.classList.contains('closed')).toBe(true);
    });

    it('starting with PanelState.Visible, shows and hides the project list panel', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.Visible
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        expect(leftPanelWrapper).toBeDefined();
        expect(leftPanelWrapper.classList.contains('closed')).toBe(false);

        // Click the close button & check that it closes the panel
        within(leftPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectListState).toBe(PanelState.Hidden);

        // Click the open button & check that it opens the panel
        const openButton = getByTestId('left-show');
        fireEvent.click(openButton);
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectListState).toBe(PanelState.Visible);

        // Check that setting the stateStore to Hidden from elsewhere closes the panel
        stateStore.set({
            projectListState: PanelState.Hidden
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));
    });

    it('starting with PanelState.Visible, shows and hides the project detail panel', async () => {
        // Set panel state and render
        stateStore.set({
            projectDetailState: PanelState.Visible
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(rightPanelWrapper).toBeDefined();
        expect(rightPanelWrapper.classList.contains('closed')).toBe(false);

        // Click the close button & check that it closes the panel
        within(rightPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectDetailState).toBe(PanelState.Hidden);

        // Click the open button & check that it opens the panel
        const openButton = getByTestId('right-show');
        fireEvent.click(openButton);
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectDetailState).toBe(PanelState.Visible);

        // Check that setting the stateStore to Hidden from elsewhere closes the panel
        stateStore.set({
            projectDetailState: PanelState.Hidden
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));
    });
});

// describe('Panels: PanelState.MousePinnable <-> PanelState.MousePinned', () => {});
// describe('Panels: PanelState.MouseUnpinnable', () => {
//     it("doesn't render close buttons", async () => {});
//     it('shows and hides the project list panel', async () => {});
//     it('shows and hides the project detail panel', async () => {});
// });
// describe('MainView with PanelState.Static & Unavailable', () => {});
