import { render, fireEvent, screen, cleanup, waitFor, within } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import MainView from '$lib/components/MainView.svelte';
import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
import Project from '$lib/base/Project/Project';
import { settingsStore, stateStore } from '$lib/base/Util/AppState';
import { get } from 'svelte/store';
import { PanelState } from '$lib/base/Util/PanelState';
import userEvent from '@testing-library/user-event';

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

describe('PanelState.Unavailable', () => {
    afterEach(cleanup);

    it('does not render the project list panel or show button', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.Unavailable
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper and button absence
        expect(() => getByTestId('left-panel-wrapper')).toThrow();
        expect(() => getByTestId('left-show')).toThrow();
    });

    it('does not render the project detail panel or show button', async () => {
        // Set panel state and render
        stateStore.set({
            projectDetailState: PanelState.Unavailable
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate right panel wrapper and button absence
        expect(() => getByTestId('right-panel-wrapper')).toThrow();
        expect(() => getByTestId('right-show')).toThrow();
    });
});

describe('PanelState.Static', () => {
    afterEach(cleanup);

    it('renders the project list panel with no hide/show UI', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.Static
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        expect(leftPanelWrapper).toBeDefined();
        expect(leftPanelWrapper.classList.contains('closed')).toBe(false);

        // Find & validate left panel show button absence
        expect(() => getByTestId('left-show')).toThrow();

        // Find & validate left panel hide button absence
        expect(() => within(leftPanelWrapper).getByTestId('right-header-button')).toThrow();
    });

    it('renders the project detail panel with no hide/show UI', async () => {
        // Set panel state and render
        stateStore.set({
            projectDetailState: PanelState.Static
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate right panel wrapper
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(rightPanelWrapper).toBeDefined();
        expect(rightPanelWrapper.classList.contains('closed')).toBe(false);

        // Find & validate right panel show button absence
        expect(() => getByTestId('right-show')).toThrow();

        // Find & validate right panel hide button absence
        expect(() => within(rightPanelWrapper).getByTestId('right-header-button')).toThrow();
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

describe('Panels: PanelState.MousePinnable <-> PanelState.MousePinned', () => {
    afterEach(cleanup);

    it('starting with PanelState.MousePinned, shows both panels on first render', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.MousePinned,
            projectDetailState: PanelState.MousePinned
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        expect(leftPanelWrapper).toBeDefined();
        expect(leftPanelWrapper.classList.contains('closed')).toBe(false);

        // Find & validate right panel wrapper
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(rightPanelWrapper).toBeDefined();
        expect(rightPanelWrapper.classList.contains('closed')).toBe(false);
    });

    it('starting with PanelState.MousePinnable, shows and hides the project list panel', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.MousePinnable
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        expect(leftPanelWrapper).toBeDefined();
        expect(leftPanelWrapper.classList.contains('closed')).toBe(true);

        // Move the mouse outside of the trigger area & check that the panel is unaffected
        const wrapper = screen.getByTestId('main-wrapper');
        const leftTriggerPosition = get(settingsStore).panelMouseTriggerWidth;
        const leftUntriggerPosition = leftTriggerPosition + 300; // (estimated panel width)
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition + 10, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable);

        // Move the mouse into the left panel trigger area & check that it opens the panel
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition - 10, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable);

        // Move the mouse outside of the trigger area & check that the panel is unaffected
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition + 10, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable);

        // Move the mouse outside of the interaction area & check that the panel closes
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable);

        // Open the panel again, then click the pin button
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition - 10, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        within(leftPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() => expect(get(stateStore).projectListState).toBe(PanelState.MousePinned));

        // Move the mouse outside of the interaction area & check that the panel stays open
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        await waitFor(() => expect(get(stateStore).projectListState).toBe(PanelState.MousePinned));

        // Within the panel, click the pin button, check that it unpins and then closes the panel
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition - 10, clientY: 5 }
        });
        within(leftPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() =>
            expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable)
        );
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));

        // Now moving the mouse within the trigger area shouldn't show the panel ...
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition - 15, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));

        // ... until we move the mouse outside of the interaction area ...
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(true));

        // ... and back in!
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: leftTriggerPosition - 15, clientY: 5 }
        });
        await waitFor(() => expect(leftPanelWrapper.classList.contains('closed')).toBe(false));
        await waitFor(() =>
            expect(get(stateStore).projectListState).toBe(PanelState.MousePinnable)
        );
    });

    it('starting with PanelState.MousePinnable, shows and hides the project detail panel', async () => {
        // Set panel state and render
        stateStore.set({
            projectDetailState: PanelState.MousePinnable
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });

        // Find & validate left panel wrapper
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(rightPanelWrapper).toBeDefined();
        expect(rightPanelWrapper.classList.contains('closed')).toBe(true);

        // Move the mouse outside of the trigger area & check that the panel is unaffected
        const wrapper = screen.getByTestId('main-wrapper');
        const rightTriggerPosition = window.innerWidth - get(settingsStore).panelMouseTriggerWidth;
        const rightUntriggerPosition = rightTriggerPosition - 300; // (estimated panel width)
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition - 10, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable);

        // Move the mouse into the left panel trigger area & check that it opens the panel
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition + 10, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable);

        // Move the mouse outside of the trigger area & check that the panel is unaffected
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition - 10, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable);

        // Move the mouse outside of the interaction area & check that the panel closes
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));
        expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable);

        // Open the panel again, then click the pin button
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition + 10, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        within(rightPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() =>
            expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinned)
        );

        // Move the mouse outside of the interaction area & check that the panel stays open
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        await waitFor(() =>
            expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinned)
        );

        // Within the panel, click the pin button, check that it unpins and then closes the panel
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition + 10, clientY: 5 }
        });
        within(rightPanelWrapper).getByTestId('right-header-button').click();
        await waitFor(() =>
            expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable)
        );
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));

        // Now moving the mouse within the trigger area shouldn't show the panel ...
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition + 15, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));

        // ... until we move the mouse outside of the interaction area ...
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightUntriggerPosition, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(true));

        // ... and back in!
        userEvent.pointer({
            target: wrapper,
            coords: { clientX: rightTriggerPosition + 15, clientY: 5 }
        });
        await waitFor(() => expect(rightPanelWrapper.classList.contains('closed')).toBe(false));
        await waitFor(() =>
            expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinnable)
        );
    });

    it('pins the panels when the show buttons are clicked (backup for non-mouse devices)', async () => {
        // Set panel state and render
        stateStore.set({
            projectListState: PanelState.MousePinnable,
            projectDetailState: PanelState.MousePinnable
        });
        const { getByTestId } = render(MainView, {
            projectConfigs: configs,
            selectedProjectTuple: projectTuple
        });
        const leftPanelWrapper = getByTestId('left-panel-wrapper');
        const rightPanelWrapper = getByTestId('right-panel-wrapper');
        expect(leftPanelWrapper.classList.contains('closed')).toBe(true);
        expect(rightPanelWrapper.classList.contains('closed')).toBe(true);

        // Click the show buttons
        const leftShowButton = getByTestId('left-show');
        const rightShowButton = getByTestId('right-show');
        fireEvent.click(leftShowButton);
        fireEvent.click(rightShowButton);
        await waitFor(() => expect(get(stateStore).projectListState).toBe(PanelState.MousePinned));
        await waitFor(() =>
            expect(get(stateStore).projectDetailState).toBe(PanelState.MousePinned)
        );
        expect(leftPanelWrapper.classList.contains('closed')).toBe(false);
        expect(rightPanelWrapper.classList.contains('closed')).toBe(false);
    });
});

// describe('Panels: PanelState.MouseUnpinnable', () => {
//     it("doesn't render close buttons", async () => {});
//     it('shows and hides the project list panel', async () => {});
//     it('shows and hides the project detail panel', async () => {});
// });
// describe('MainView with PanelState.Static & Unavailable', () => {});
