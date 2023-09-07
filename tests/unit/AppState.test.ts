import { describe, it, expect, afterEach } from 'vitest';
import { settingsStore } from '$lib/base/Util/AppState';

import { config } from '../../src/config/config';
import { SortOrder } from '$lib/base/Util/ConfigTypes';
import { PanelState } from '$lib/base/Util/PanelState';
import { get } from 'svelte/store';

describe('AppStateStore', () => {
    afterEach(() => {
        localStorage.clear();
        settingsStore.reset();
    });

    it('stores and restores properly typed settings', () => {
        // Check default values
        expect(get(settingsStore).showExperiments).toBe(config.showExperiments);
        expect(get(settingsStore).projectSortOrder).toBe(config.projectSortOrder);
        expect(get(settingsStore).groupSortOrder).toBe(config.groupSortOrder);
        expect(get(settingsStore).defaultProjectListState).toBe(config.defaultProjectListState);
        expect(get(settingsStore).defaultProjectDetailState).toBe(config.defaultProjectDetailState);

        // Check set values (these should be different than the config defaults)
        settingsStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.Alphabetical,
            groupSortOrder: SortOrder.Chronological,
            defaultProjectListState: PanelState.Visible,
            defaultProjectDetailState: PanelState.Unavailable
        });
        expect(get(settingsStore).showExperiments).toBe(true);
        expect(get(settingsStore).projectSortOrder).toBe(SortOrder.Alphabetical);
        expect(get(settingsStore).groupSortOrder).toBe(SortOrder.Chronological);
        expect(get(settingsStore).defaultProjectListState).toBe(PanelState.Visible);
        expect(get(settingsStore).defaultProjectDetailState).toBe(PanelState.Unavailable);
    });

    it('only persists values that are specified in userSettingsLabels', () => {
        // Check default values
        expect(localStorage.getItem('settings_showExperiments')).toBeNull();
        expect(localStorage.getItem('settings_projectSortOrder')).toBeNull();

        // Check set values (these should be different than the config defaults)
        settingsStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.ReverseChronological,
            groupSortOrder: SortOrder.Alphabetical,
            defaultProjectListState: 'visible',
            defaultProjectDetailState: 'unavailable'
        });
        expect(localStorage.getItem('settings_showExperiments')).toContain('true');
        expect(localStorage.getItem('settings_projectSortOrder')).toContain(
            'reverse-chronological'
        );
        expect(localStorage.getItem('settings_groupSortOrder')).toBeNull();
        expect(localStorage.getItem('settings_defaultProjectListState')).toBeNull();
        expect(localStorage.getItem('settings_defaultProjectDetailState')).toBeNull();
    });

    it('properly updates with new file values when reset (settingsStore)', () => {
        // Check default values after first load/reset (just in case)
        expect(localStorage.getItem('settings_projectSortOrder')).toBeNull();
        expect(localStorage.getItem('settings_lastInitialValue_projectSortOrder')).toContain(
            'chronological'
        );

        // If we had set projectSortOrder as reverse chron in the file for a previous load,
        // it should now reset to original file value (lastFileValue_projectSortOrder in LS)
        // despite projectSortOrder in LS, which would be the last user setting here
        localStorage.setItem('settings_lastInitialValue_projectSortOrder', 'reverse-chronological');
        localStorage.setItem('settings_projectSortOrder', 'alphabetical');
        settingsStore.reset();
        expect(get(settingsStore).showExperiments).toBe(false);
        expect(get(settingsStore).projectSortOrder).toBe(SortOrder.Chronological);
        expect(localStorage.getItem('settings_lastInitialValue_projectSortOrder')).toContain(
            'chronological'
        );
        expect(localStorage.getItem('settings_projectSortOrder')).toContain('chronological');
    });
});
