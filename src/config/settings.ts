import { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
import { PanelState } from '$lib/base/Util/PanelState';

/**
 * This file contains configuration options for the Sketchbook app. You can change these values to
 * customize the app's behavior, and include any as keys in `userSettingsLabels` to make them
 * configurable in the user settings panel.
 */

// The imported `dev` boolean will be true locally, but false in production. Use this for any
// development-specific default settings below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { dev } from '$app/environment';

// Experimental projects will only appear in the project list if this is set to true.
const showExperiments = true;

// If true, the project list and detail panels will float over project content.
const overlayPanels = true;

// The default states of the project list and detail panels; these are starting values, which will
// be updated as the user interacts with the UI (and/or settings panel), and are then persisted.
const projectListPanelState = PanelState.Visible;
const projectDetailPanelState = PanelState.Visible;

// Sketchbook redirects root navigation to the first project listed. In this case, you can override
// persisted or default project panel state, e.g. showing the project list panel on root navigation.
const projectListRedirectOverride = true;
const projectListRedirectOverrideState = PanelState.Visible;

// When using mouse-triggering options for the project list and detail panels above, this is the
// width of the trigger areas on the left & right, in pixels.
const panelMouseTriggerWidth = 50;

// When panels are closed, their "show" buttons will be hidden after this many milliseconds (if
// defined). Mouse movement will make them reappear. Buttons are always visible on touch devices.
const hidePanelButtonsTimeout: number | undefined = 2000;

// Project and group label sorting
const projectSortOrder = SortOrder.ReverseChronological;
const groupSortOrder = SortOrder.Alphabetical;

// Always show presets UI; otherwise, the UI will only be visible when a project has presets.
const alwaysShowPresets = false;

// Allow exporting the current project parameter values in a preset JSON file from the presets UI.
// These files can be added directly to a project's `presets` directory and used as bundled presets.
const enablePresetExport = dev;

// Anything listed here will appear in the user settings panel with the given label. Values changed
// in the settings panel will be persisted in cookies, and values above will be used as defaults.
export const userSettingsLabels: Record<string, string> = {
    showExperiments: 'Show Experiments',
    overlayPanels: 'Overlay Panels',
    projectListPanelState: 'Project List State',
    projectDetailPanelState: 'Project Detail State',
    panelMouseTriggerWidth: 'Mouse Trigger Width (px)',
    hidePanelButtonsTimeout: 'Hide Panel Timeout (ms)',
    projectSortOrder: 'Project Sorting',
    groupSortOrder: 'Group Sorting',
    alwaysShowPresets: 'Always Show Presets',
    enablePresetExport: 'Enable Preset Export'
};

// Export all settings for use elsewhere in the app.
export const config = {
    showExperiments,
    overlayPanels,
    projectListPanelState,
    projectDetailPanelState,
    projectListRedirectOverride,
    projectListRedirectOverrideState,
    panelMouseTriggerWidth,
    hidePanelButtonsTimeout,
    projectSortOrder,
    groupSortOrder,
    alwaysShowPresets,
    enablePresetExport
};
