import { MouseState, mouseStateTransition } from '$lib/base/Util/MouseState';
import { describe, it, expect } from 'vitest';

const leftThresholds = { in: 50, out: 100 };
const rightThresholds = { in: 250, out: 200 };

describe('MouseState', () => {
    it("doesn't trigger with middle movement", () => {
        let state = MouseState.NoTrigger;
        state = mouseStateTransition(state, 150, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.NoTrigger);
    });

    it('triggers, holds, and untriggers on the left side', () => {
        let state = MouseState.NoTrigger;
        state = mouseStateTransition(state, 25, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.LeftTrigger);
        state = mouseStateTransition(state, 75, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.LeftTrigger);
        state = mouseStateTransition(state, 125, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.NoTrigger);
    });

    it('triggers, holds, and untriggers on the right side', () => {
        let state = MouseState.NoTrigger;
        state = mouseStateTransition(state, 275, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.RightTrigger);
        state = mouseStateTransition(state, 225, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.RightTrigger);
        state = mouseStateTransition(state, 175, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.NoTrigger);
    });

    it('requires move out of cleared left trigger zone before re-triggering', () => {
        let state = MouseState.ClearedLeft;
        state = mouseStateTransition(state, 25, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.ClearedLeft);
        state = mouseStateTransition(state, 75, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.NoTrigger);
    });

    it('requires move out of cleared right trigger zone before re-triggering', () => {
        let state = MouseState.ClearedRight;
        state = mouseStateTransition(state, 275, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.ClearedRight);
        state = mouseStateTransition(state, 225, leftThresholds, rightThresholds);
        expect(state).toBe(MouseState.NoTrigger);
    });
});
