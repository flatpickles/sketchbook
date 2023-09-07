import { render, fireEvent, screen, cleanup, waitFor, within } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import MainView from '$lib/components/MainView.svelte';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import Project from '$lib/base/Project/Project';
import { stateStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';
import type { PanelState } from '$lib/base/Util/PanelState';

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

// describe('Panels: PanelState.Visible <-> PanelState.Hidden', () => {
//     // check default states with stateStore values // here or elsewherez
//     // it('shows and hides the project list panel', async () => {});
//     // it('shows and hides the project detail panel', async () => {});
// });
// describe('Panels: PanelState.MousePinnable <-> PanelState.MousePinned', () => {});
// describe('Panels: PanelState.MouseUnpinnable', () => {
//     it("doesn't render close buttons", async () => {});
//     it('shows and hides the project list panel', async () => {});
//     it('shows and hides the project detail panel', async () => {});
// });
// describe('MainView with PanelState.Static & Unavailable', () => {});
