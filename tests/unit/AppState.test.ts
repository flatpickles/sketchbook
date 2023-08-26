import { describe, it, expect, afterEach } from 'vitest';
import { AppStateStore } from '$lib/base/AppState';

import { PanelState, SortOrder, config } from '../../src/config/config';
import { get } from 'svelte/store';

describe('AppStateStore', () => {
    afterEach(() => {
        localStorage.clear();
        AppStateStore.reset();
    });

    it('stores and restores properly typed settings', () => {
        // Check default values
        expect(get(AppStateStore).showExperiments).toBe(config.showExperiments);
        expect(get(AppStateStore).projectSortOrder).toBe(config.projectSortOrder);
        expect(get(AppStateStore).groupSortOrder).toBe(config.groupSortOrder);
        expect(get(AppStateStore).defaultProjectListState).toBe(config.defaultProjectListState);
        expect(get(AppStateStore).defaultProjectDetailState).toBe(config.defaultProjectDetailState);

        // Check set values (these should be different than the config defaults)
        AppStateStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.Alphabetical,
            groupSortOrder: SortOrder.Chronological,
            defaultProjectListState: PanelState.Visible,
            defaultProjectDetailState: PanelState.Unavailable
        });
        expect(get(AppStateStore).showExperiments).toBe(true);
        expect(get(AppStateStore).projectSortOrder).toBe(SortOrder.Alphabetical);
        expect(get(AppStateStore).groupSortOrder).toBe(SortOrder.Chronological);
        expect(get(AppStateStore).defaultProjectListState).toBe(PanelState.Visible);
        expect(get(AppStateStore).defaultProjectDetailState).toBe(PanelState.Unavailable);
    });

    it('only persists values that are specified in userSettingsLabels', () => {
        // Check default values
        expect(localStorage.getItem('showExperiments')).toBeNull();
        expect(localStorage.getItem('projectSortOrder')).toBeNull();

        // Check set values (these should be different than the config defaults)
        AppStateStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.ReverseChronological,
            groupSortOrder: SortOrder.Alphabetical,
            defaultProjectListState: 'visible',
            defaultProjectDetailState: 'unavailable'
        });
        expect(localStorage.getItem('showExperiments')).toContain('true');
        expect(localStorage.getItem('projectSortOrder')).toContain('reverse-chronological');
        expect(localStorage.getItem('groupSortOrder')).toBeNull();
        expect(localStorage.getItem('defaultProjectListState')).toBeNull();
        expect(localStorage.getItem('defaultProjectDetailState')).toBeNull();
    });

    it('properly updates with new file values when reset', () => {
        // Check default values after first load/reset (just in case)
        expect(localStorage.getItem('projectSortOrder')).toBeNull();
        expect(localStorage.getItem('lastFileValue_projectSortOrder')).toContain('chronological');

        // If we had set projectSortOrder as reverse chron in the file for a previous load,
        // it should now reset to original file value (lastFileValue_projectSortOrder in LS)
        // despite projectSortOrder in LS, which would be the last user setting here
        localStorage.setItem('lastFileValue_projectSortOrder', 'reverse-chronological');
        localStorage.setItem('projectSortOrder', 'alphabetical');
        AppStateStore.reset();
        expect(get(AppStateStore).showExperiments).toBe(false);
        expect(get(AppStateStore).projectSortOrder).toBe(SortOrder.Chronological);
        expect(localStorage.getItem('lastFileValue_projectSortOrder')).toContain('chronological');
        expect(localStorage.getItem('projectSortOrder')).toContain('chronological');
    });
});
