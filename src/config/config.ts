import { PanelState, SortOrder } from '$lib/base/Util/ConfigTypes';

// Experimental projects will only appear in the project list if this is set to true
const showExperiments = false;

// The default state of the project list and detail panels
const defaultProjectListState = PanelState.Visible;
const defaultProjectDetailState = PanelState.Visible;

// Project and group label sorting
const projectSortOrder = SortOrder.Chronological;
const groupSortOrder = SortOrder.Alphabetical;

// Anything listed here will appear in the user settings panel with the given label. Values changed
// in the settings panel will be persisted in local storage, and the values set above will be used
// as defaults.
export const userSettingsLabels: Record<string, string> = {
    showExperiments: 'Experiments',
    projectSortOrder: 'Project Sorting'
};

// Export all settings for use elsewhere in the app
export const config = {
    showExperiments,
    defaultProjectListState,
    defaultProjectDetailState,
    projectSortOrder,
    groupSortOrder
};
