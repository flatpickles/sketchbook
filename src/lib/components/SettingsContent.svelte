<script lang="ts">
    import ParamItem from './ParamItem/ParamItem.svelte';
    import { get } from 'svelte/store';
    import { AppStateStore } from '$lib/base/AppState';

    import type { ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import {
        BooleanParamConfigDefaults,
        type BooleanParamConfig
    } from '$lib/base/ParamConfig/BooleanParamConfig';
    import {
        NumericArrayParamConfigDefaults,
        type NumericArrayParamConfig,
        NumericArrayParamStyle
    } from '$lib/base/ParamConfig/NumericArrayParamConfig';
    import {
        type ParamValueType,
        type AnyParamValueType,
        ParamGuards
    } from '$lib/base/ParamConfig/ParamTypes';
    import {
        FunctionParamConfigDefaults,
        type FunctionParamConfig
    } from '$lib/base/ParamConfig/FunctionParamConfig';

    // Define all settings params.
    // These are backed by values in AppStateStore's settings object, or the functions map below
    const settingsParams: ParamConfig[] = [
        {
            ...BooleanParamConfigDefaults,
            key: 'showExperimentalProjects',
            name: 'Experiments'
        } as BooleanParamConfig,
        {
            ...NumericArrayParamConfigDefaults,
            key: 'canvasSize',
            name: 'Canvas Size',
            style: NumericArrayParamStyle.CompactField,
            step: 1,
            min: 0,
            max: 100000
        } as NumericArrayParamConfig,
        {
            ...FunctionParamConfigDefaults,
            key: 'reset',
            name: 'Reset Sketchbook',
            fullWidthInput: true,
            buttonText: 'Reset Sketchbook'
        } as FunctionParamConfig
    ];

    // Settings function map, keyed by param key
    const settingsFunctions: Record<string, () => void> = {
        reset: () => {
            localStorage.clear();
            location.reload();
        }
    };

    // Update settings in the backing app state store when a param is updated
    function paramUpdated(event: CustomEvent) {
        const updatedConfig: ParamConfig = event.detail.config;
        if (ParamGuards.isFunctionParamConfig(updatedConfig)) {
            settingsFunctions[updatedConfig.key]();
        } else {
            const value: ParamValueType<typeof updatedConfig> = event.detail.value;
            AppStateStore.update((state) => {
                const currentSettings: Record<string, AnyParamValueType> = state.settings;
                currentSettings[updatedConfig.key] = value;
                return state;
            });
        }
    }

    // Get the properly typed initial value for a given param
    function initialValueForParam<T extends ParamConfig>(paramConfig: T): ParamValueType<T> {
        const currentSettings: Record<string, AnyParamValueType> = get(AppStateStore).settings;
        return currentSettings[paramConfig.key] as ParamValueType<T>;
    }
</script>

<div class="settings-grid">
    {#each settingsParams as param, i}
        <ParamItem
            config={param}
            value={initialValueForParam(param)}
            even={i % 2 === 1}
            disabled={false}
            on:update={paramUpdated}
        />
    {/each}
</div>

<style lang="scss">
    .settings-grid {
        width: 100%;
        padding: calc($panel-section-spacing / 2) 0;

        // Fade out edges
        mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) calc($panel-section-spacing / 2),
            rgba(0, 0, 0, 1) calc(100% - $panel-section-spacing / 2),
            rgba(0, 0, 0, 0)
        );

        // Scroll with no scrollbar
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        display: grid;
        grid-template-columns: fit-content($parameter-label-max-width) 1fr;
        row-gap: $parameter-item-spacing-vertical;
        align-items: center;
    }

    // Webkit hide scrollbar
    .settings-grid::-webkit-scrollbar {
        display: none;
    }
</style>
