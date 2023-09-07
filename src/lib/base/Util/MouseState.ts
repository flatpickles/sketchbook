/**
 * Utilities for tracking mouse state, used for panel interaction in MainView.svelte
 */

export enum MouseState {
    // Default state: no interaction
    NoTrigger = 'noTrigger',

    // Triggered states require exit from threshold "out" position before re-triggering
    LeftTrigger = 'leftTrigger',
    RightTrigger = 'rightTrigger',

    // Cleared states require exit from threshold "in" position before re-triggering
    ClearedLeft = 'clearedLeft',
    ClearedRight = 'clearedRight'
}

type MouseTriggerThresholds = {
    in: number;
    out: number;
};

export function mouseStateTransition(
    currentState: MouseState,
    newPosition: number,
    leftThresholds: MouseTriggerThresholds,
    rightThresholds: MouseTriggerThresholds
): MouseState {
    // Apply ins & outs based on current mouse state
    if (currentState === MouseState.NoTrigger) {
        // Trigger with movement into left/right trigger zones
        if (newPosition < leftThresholds.in) return MouseState.LeftTrigger;
        else if (newPosition > rightThresholds.in) return MouseState.RightTrigger;
    } else if (currentState === MouseState.LeftTrigger) {
        // Untrigger with movement out of left interaction zone
        if (newPosition > leftThresholds.out) return MouseState.NoTrigger;
    } else if (currentState === MouseState.RightTrigger) {
        // Untrigger with movement out of right interaction zone
        if (newPosition < rightThresholds.out) return MouseState.NoTrigger;
    } else if (currentState == MouseState.ClearedLeft) {
        // Untrigger with movement out of left trigger zone after clearing
        if (newPosition > leftThresholds.in) return MouseState.NoTrigger;
    } else if (currentState == MouseState.ClearedRight) {
        // Untrigger with movement out of right trigger zone after clearing
        if (newPosition < rightThresholds.in) return MouseState.NoTrigger;
    }

    // Fall back to current state
    return currentState;
}
