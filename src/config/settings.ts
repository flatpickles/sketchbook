import { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
import { PanelState } from '$lib/base/Util/PanelState';

/**
 * This file contains configuration options for the Sketchbook app. You can change these values to
 * customize the app's behavior. See the docs for more info about each of these options.
 */

// The imported `dev` boolean will be true locally, but false in production. Use this for any
// development-specific default settings below.
import { dev } from '$app/environment';

// Experimental projects will only appear in the project list if this is set to true.
const showExperiments = dev;

// If true, the project list and detail panels will float over project content.
const overlayPanels = true;

// The default states of the project list and detail panels; these are starting values, which will
// be updated as the user interacts with the UI (and/or settings panel), and are then persisted.
const projectListPanelState = PanelState.Visible;
const projectDetailPanelState = PanelState.Visible;

// When using mouse-triggering options for the project list and detail panels above, this is the
// width of the trigger areas on the left & right, in pixels.
const panelMouseTriggerWidth = 50;

// When panels are closed, their "show" buttons will be hidden after this many milliseconds (if
// defined). Mouse movement will make them reappear. Buttons are always visible on touch devices.
const hidePanelButtonsTimeout: number | undefined = 2000;

// Project and group label sorting
const projectSortOrder = SortOrder.Alphabetical;
const groupSortOrder = SortOrder.Alphabetical;

// Anything listed here will appear in the user settings panel with the given label. Values changed
// in the settings panel will be persisted in local storage, and the values set above will be used
// as defaults.
export const userSettingsLabels: Record<string, string> = {
    projectSortOrder: 'Project Sorting',
    showExperiments: 'Show Experiments',
    overlayPanels: 'Overlay Panels'
};

// Export all settings for use elsewhere in the app.
export const config = {
    showExperiments,
    overlayPanels,
    projectListPanelState,
    projectDetailPanelState,
    panelMouseTriggerWidth,
    hidePanelButtonsTimeout,
    projectSortOrder,
    groupSortOrder
};
