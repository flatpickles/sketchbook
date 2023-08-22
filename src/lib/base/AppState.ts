import { persisted } from 'svelte-local-storage-store';

const AppStateDefaults = {
    projectListPanelVisible: true,
    settingsVisible: false,
    projectDetailPanelVisible: true,
    settings: {
        showExperimentalProjects: false,
        canvasSize: [500, 700]
    }
};

export const AppStateStore = persisted('app-state', AppStateDefaults);
