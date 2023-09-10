import { SortOrder } from '$lib/base/Util/ConfigTypes';
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

// The default state of the project list and detail panels.
const defaultProjectListState = PanelState.Visible;
const defaultProjectDetailState = PanelState.Visible;

// When using mouse-triggering options for the project list and detail panels above, this is the
// width of the trigger areas on the left & right, in pixels.
const panelMouseTriggerWidth = 50;

// Project and group label sorting
const projectSortOrder = SortOrder.Chronological;
const groupSortOrder = SortOrder.Alphabetical;

// Anything listed here will appear in the user settings panel with the given label. Values changed
// in the settings panel will be persisted in local storage, and the values set above will be used
// as defaults.
export const userSettingsLabels: Record<string, string> = {
    showExperiments: 'Experiments',
    projectSortOrder: 'Project Sorting',
    overlayPanels: 'Overlay Panels'
};

// Export all settings for use elsewhere in the app.
export const config = {
    showExperiments,
    overlayPanels,
    defaultProjectListState,
    defaultProjectDetailState,
    panelMouseTriggerWidth,
    projectSortOrder,
    groupSortOrder
};
