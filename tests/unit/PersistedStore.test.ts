/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { createPersistedStore } from '$lib/base/Util/PersistedStore';
import { SortOrder } from '$lib/base/ProjectLoading/ProjectPresentation';
import { PanelState } from '$lib/base/Util/PanelState';
import { get, type Writable } from 'svelte/store';
import Cookies from 'js-cookie';
import * as Environment from '$app/environment';

// A little mock config for these tests
type ConfigType = {
    showExperiments: boolean;
    projectSortOrder: SortOrder;
    groupSortOrder: SortOrder;
    defaultProjectListState: PanelState;
    defaultProjectDetailState: PanelState;
};

function getMockStore(): [ConfigType, ReturnType<typeof createPersistedStore>] {
    const config = {
        showExperiments: false,
        projectSortOrder: SortOrder.Chronological,
        groupSortOrder: SortOrder.Alphabetical,
        defaultProjectListState: PanelState.Visible,
        defaultProjectDetailState: PanelState.Visible
    };
    return [
        config,
        createPersistedStore('settings', config, ['showExperiments', 'projectSortOrder'])
    ];
}

describe('AppStateStore', () => {
    beforeEach(() => {
        // Clear cookies
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    });

    it('does not use cookies until values are changed in prod', () => {
        vi.spyOn(Environment, 'dev', 'get').mockReturnValue(false);
        const [config, settingsStore] = getMockStore();
        expect(document.cookie).toBe('');
        const cookieStore = createPersistedStore('cookie', config);
        expect(document.cookie).toBe('');
        cookieStore.reset();
        expect(document.cookie).toBe('');
        expect(get(cookieStore).showExperiments).toBe(config.showExperiments);
        expect(document.cookie).toBe('');
        cookieStore.set({ ...get(cookieStore), showExperiments: true });
        expect(document.cookie).toContain('cookie_showExperiments=true');
        expect(document.cookie).not.toContain('cookie_lastInitialValue_showExperiments=false');
        cookieStore.reset();
        expect(document.cookie).toContain('cookie_lastInitialValue_showExperiments=false');
        vi.spyOn(Environment, 'dev', 'get').mockReturnValue(true);
    });

    it('stores and restores properly typed settings', () => {
        const [config, settingsStore] = getMockStore();

        // Check default values
        const currentStore = get(settingsStore) as ConfigType;
        expect(currentStore.showExperiments).toBe(config.showExperiments);
        expect(currentStore.projectSortOrder).toBe(config.projectSortOrder);
        expect(currentStore.groupSortOrder).toBe(config.groupSortOrder);
        expect(currentStore.defaultProjectListState).toBe(config.defaultProjectListState);
        expect((get(settingsStore) as ConfigType).defaultProjectDetailState).toBe(
            config.defaultProjectDetailState
        );

        // Check set values (these should be different than the config defaults)
        settingsStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.Alphabetical,
            groupSortOrder: SortOrder.Chronological,
            defaultProjectListState: PanelState.Visible,
            defaultProjectDetailState: PanelState.Unavailable
        });
        const updatedStore = get(settingsStore) as ConfigType;
        expect(updatedStore.showExperiments).toBe(true);
        expect(updatedStore.projectSortOrder).toBe(SortOrder.Alphabetical);
        expect(updatedStore.groupSortOrder).toBe(SortOrder.Chronological);
        expect(updatedStore.defaultProjectListState).toBe(PanelState.Visible);
        expect(updatedStore.defaultProjectDetailState).toBe(PanelState.Unavailable);
    });

    it('only persists values that are specified', () => {
        const [config, settingsStore] = getMockStore();
        // Check default values
        expect(Cookies.get('settings_showExperiments')).toBeUndefined();
        expect(Cookies.get('settings_projectSortOrder')).toBeUndefined();

        // Check set values (these should be different than the config defaults)
        settingsStore.set({
            showExperiments: true,
            projectSortOrder: SortOrder.ReverseChronological,
            groupSortOrder: SortOrder.Alphabetical,
            defaultProjectListState: 'visible',
            defaultProjectDetailState: 'unavailable'
        });
        expect(Cookies.get('settings_showExperiments')).toContain('true');
        expect(Cookies.get('settings_projectSortOrder')).toContain('reverse-chronological');
        expect(Cookies.get('settings_groupSortOrder')).toBeUndefined();
        expect(Cookies.get('settings_defaultProjectListState')).toBeUndefined();
        expect(Cookies.get('settings_defaultProjectDetailState')).toBeUndefined();
    });

    it('properly updates with new file values when reset (settingsStore) - dev', () => {
        // Check default values after first load/reset (just in case)
        expect(Cookies.get('settings_projectSortOrder')).toBeUndefined();
        expect(Cookies.get('settings_lastInitialValue_projectSortOrder')).toBeUndefined();

        const [config, settingsStore] = getMockStore();

        // If we had set projectSortOrder as reverse chron in the file for a previous load,
        // it should now reset to original file value (lastFileValue_projectSortOrder in LS)
        // despite projectSortOrder in LS, which would be the last user setting here
        Cookies.set('settings_lastInitialValue_projectSortOrder', 'reverse-chronological');
        Cookies.set('settings_projectSortOrder', 'alphabetical');
        settingsStore.reset();
        const updatedStore = get(settingsStore) as ConfigType;
        expect(updatedStore.showExperiments).toBe(config.showExperiments);
        expect(updatedStore.projectSortOrder).toBe(SortOrder.Chronological);
        expect(Cookies.get('settings_lastInitialValue_projectSortOrder')).toContain(
            'chronological'
        );
        expect(Cookies.get('settings_projectSortOrder')).toContain('chronological');
    });

    it('properly updates with new file values when reset, if edited (settingsStore) - prod', () => {
        vi.spyOn(Environment, 'dev', 'get').mockReturnValue(false);
        const [config, settingsStore] = getMockStore();
        // Check default values after first load/reset (just in case)
        expect(Cookies.get('settings_projectSortOrder')).toBeUndefined();
        expect(Cookies.get('settings_lastInitialValue_projectSortOrder')).toBeUndefined();

        // If we had set projectSortOrder as reverse chron in the file for a previous load,
        // it should now reset to original file value (lastFileValue_projectSortOrder in LS)
        // despite projectSortOrder in LS, which would be the last user setting here
        Cookies.set('settings_lastInitialValue_projectSortOrder', 'reverse-chronological');
        Cookies.set('settings_projectSortOrder', 'alphabetical');
        settingsStore.reset();
        const updatedStore = get(settingsStore) as ConfigType;
        expect(updatedStore.showExperiments).toBe(config.showExperiments);
        expect(updatedStore.projectSortOrder).toBe(SortOrder.Chronological);
        expect(Cookies.get('settings_lastInitialValue_projectSortOrder')).toContain(
            'chronological'
        );
        expect(Cookies.get('settings_projectSortOrder')).toContain('chronological');
        vi.spyOn(Environment, 'dev', 'get').mockReturnValue(true);
    });

    it('loads in cookies values as expected', () => {
        const [config, settingsStore] = getMockStore();
        const currentStore = get(settingsStore) as ConfigType;
        expect(currentStore.showExperiments).toBe(config.showExperiments);
        expect(currentStore.projectSortOrder).toBe(config.projectSortOrder);
        const mockCookies: Cookies.CookieAttributes = {
            get: (key: string) => {
                console.log(key);
                switch (key) {
                    case 'settings_showExperiments':
                        return 'true';
                    case 'settings_projectSortOrder':
                        return '"reverse-chronological"';
                    default:
                        return undefined;
                }
            }
        };
        settingsStore.loadCookies(mockCookies);
        // Check set values (these should be different than the config defaults)
        const updatedStore = get(settingsStore) as ConfigType;
        expect(updatedStore.showExperiments).toBe(true);
        expect(updatedStore.projectSortOrder).toBe(SortOrder.ReverseChronological);
    });
});
