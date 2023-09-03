// Possible states for the project list and detail panels (set defaults in config/config.ts)
export enum PanelState {
    Visible = 'visible', // shown, can toggle to hidden
    Hidden = 'hidden', // not shown, can toggle to visible
    MousePinned = 'mouse-pinned', // shown, toggles to mouse-pinnable
    MousePinnable = 'mouse-pinnable', // shows & hides with mouse position, toggles to mouse-pinned
    MouseUnpinnable = 'mouse-unpinnable', // shows & hides with mouse position, cannot toggle
    Static = 'static', // shown, cannot toggle
    Unavailable = 'unavailable' // not shown, cannot toggle
}

// Possible sort orders for projects and groups (set defaults in config/config.ts)
export enum SortOrder {
    Alphabetical = 'alphabetical',
    Chronological = 'chronological',
    ReverseChronological = 'reverse-chronological'
}
