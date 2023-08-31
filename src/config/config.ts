// Experimental projects will only appear in the project list if this is set to true
const showExperiments = false;

// The default state of the project list and detail panels
export enum PanelState {
    Hidden = 'hidden', // not shown, can toggle to visible
    Visible = 'visible', // shown, can toggle to hidden
    Static = 'static', // shown, cannot toggle
    Unavailable = 'unavailable' // not shown, cannot toggle
}
const defaultProjectListState = PanelState.Static;
const defaultProjectDetailState = PanelState.Static;

// Project and group label sorting
export enum SortOrder {
    Alphabetical = 'alphabetical',
    Chronological = 'chronological',
    ReverseChronological = 'reverse-chronological'
}
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
