<script lang="ts">
    import {
        defaultPresetKey,
        type Preset,
        type PresetMap
    } from '$lib/base/ProjectLoading/PresetLoader';
    import { createEventDispatcher } from 'svelte';

    export let presets: PresetMap;
    export let currentPresetKey: string;
    export let edited = false;

    let dispatchEvent = createEventDispatcher();

    // Simple alphabetical sorting for now
    $: presetList = Object.values(presets).sort((presetA, presetB) => {
        if (presetA.key === defaultPresetKey) {
            return -1;
        } else if (presetB.key === defaultPresetKey) {
            return 1;
        } else {
            return presetA.key.localeCompare(presetB.key);
        }
    });
    $: currentPresetIndex = presetList.findIndex((preset) => preset.key === currentPresetKey);

    function nextPreset() {
        if (currentPresetIndex < presetList.length - 1) {
            const nextPresetKey = presetList[currentPresetIndex + 1].key;
            dispatchEvent('preset-selected', nextPresetKey);
        }
    }

    function previousPreset() {
        if (currentPresetIndex > 0) {
            const nextPresetKey = presetList[currentPresetIndex - 1].key;
            dispatchEvent('preset-selected', nextPresetKey);
        }
    }
</script>

<div class="presets-wrapper" data-testid="presets-ui">
    <div class="preset-selector">
        <i
            class="fa fa-angle-left preset-arrow"
            class:disabled={currentPresetIndex === 0}
            on:click={previousPreset}
            on:keypress={previousPreset}
        />
        {presetList[currentPresetIndex].title}
        {#if edited}*{/if}
        <i
            class="fa fa-angle-right preset-arrow"
            class:disabled={currentPresetIndex === presetList.length - 1}
            on:click={nextPreset}
            on:keypress={nextPreset}
        />
    </div>
</div>

<style lang="scss">
    .presets-wrapper {
        width: 100%;
        padding: calc($panel-content-inset / 2) $panel-content-inset;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: $preset-control-item-spacing;
        user-select: none;
    }

    .preset-selector {
        @include preset-control-item;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .preset-arrow {
        cursor: pointer;
    }

    .disabled {
        color: rgba(0, 0, 0, 30%);
        cursor: default;
    }
</style>
