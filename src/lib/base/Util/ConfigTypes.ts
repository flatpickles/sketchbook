// Possible states for the project list and detail panels (set defaults in config/config.ts)
export enum PanelState {
    Visible = 'visible', // shown, can toggle to hidden
    Hidden = 'hidden', // not shown, can toggle to visible
    MouseVisible = 'mouse-visible', // shown, toggles to mouse-hidden
    MouseHidden = 'mouse-hidden', // hidden, toggles to mouse-visible
    Static = 'static', // shown, cannot toggle
    Unavailable = 'unavailable' // not shown, cannot toggle
}

// Possible sort orders for projects and groups (set defaults in config/config.ts)
export enum SortOrder {
    Alphabetical = 'alphabetical',
    Chronological = 'chronological',
    ReverseChronological = 'reverse-chronological'
}
