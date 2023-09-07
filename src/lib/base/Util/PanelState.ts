import type { MouseState } from './MouseState';

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

// Return the toggle state for a panel based on its current state
export function toggledPanelState(state: PanelState) {
    switch (state) {
        case PanelState.Visible:
            return PanelState.Hidden;
        case PanelState.Hidden:
            return PanelState.Visible;
        case PanelState.MousePinnable:
            return PanelState.MousePinned;
        case PanelState.MousePinned:
            return PanelState.MousePinnable;
        default:
            return state;
    }
}

// Determine whether a panel should be shown based on its state and the current mouse state
export function panelShown(panelState: PanelState, mouseState: MouseState, mouseTest: MouseState) {
    const explicitlyVisible = [
        PanelState.Visible,
        PanelState.Static,
        PanelState.MousePinned
    ].includes(panelState);
    const mouseShowable = [PanelState.MousePinnable, PanelState.MouseUnpinnable].includes(
        panelState
    );
    return explicitlyVisible || (mouseShowable && mouseState === mouseTest);
}

// Return the icon string to use for a panel header based on its state
export function headerIconForPanelState(state: PanelState) {
    switch (state) {
        case PanelState.Visible:
            return 'fa-close';
        case PanelState.Hidden:
            return 'fa-close';
        case PanelState.MousePinned:
            return 'fa-close';
        case PanelState.MousePinnable:
            return 'fa-plus';
        default:
            return undefined;
    }
}
