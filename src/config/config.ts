import { PanelState, SortOrder } from '$lib/base/Util/ConfigTypes';

// Experimental projects will only appear in the project list if this is set to true
const showExperiments = false;

// If true, the project list and detail panels will float over project content
const overlayPanels = true;

// The default state of the project list and detail panels
const defaultProjectListState = PanelState.MousePinnable;
const defaultProjectDetailState = PanelState.Visible;

// When using mouse-triggering options for the project list and detail panels above, this is the
// width of the trigger areas on the left & right, in pixels
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

// Export all settings for use elsewhere in the app
export const config = {
    showExperiments,
    overlayPanels,
    defaultProjectListState,
    defaultProjectDetailState,
    panelMouseTriggerWidth,
    projectSortOrder,
    groupSortOrder
};
