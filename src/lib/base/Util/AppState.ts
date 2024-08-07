import { config } from '$config/settings';
import { MouseState } from './MouseState';
import { createPersistedStore } from './PersistedStore';

import { writable } from 'svelte/store';

// The settingsStore is backed by values in config. All values will be persisted as cookies, and
// each will be reset to its backing value when that value changes (e.g. via edits in settings.ts)
export const settingsStore = createPersistedStore('settings', config);

// The stateStore is not persisted, and maintains the state of the app
const stateDefaults = {
    settingsPresented: false,
    currentMouseState: MouseState.NoTrigger,
    panelResizing: false,
    panelShowButtonsVisible: true
};
export const stateStore = writable(stateDefaults);

// Frame recording details
export const captureControlStore = createPersistedStore(
    'captureControl',
    {
        // persisted:
        startTime: 0,
        duration: 5,
        fps: 60,

        // not persisted:
        imgSaveQueued: false,
        recordingVideo: false,
        recordingFrames: false
    },
    ['startTime', 'duration', 'fps']
);
