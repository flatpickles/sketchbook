<script lang="ts">
    import { defaultPresetKey, type PresetMap } from '$lib/base/ProjectLoading/PresetLoader';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { createEventDispatcher } from 'svelte';

    export let presets: PresetMap;
    export let currentPresetKey: string;
    export let edited = false;
    export let enablePresetExport = $settingsStore.enablePresetExport;

    let dispatchEvent = createEventDispatcher();
    let presetSelector: HTMLSelectElement;

    $: presetList = Object.values(presets).sort((presetA, presetB) => {
        // Simple alphabetical sorting for now
        if (presetA.key === defaultPresetKey) {
            return -1;
        } else if (presetB.key === defaultPresetKey) {
            return 1;
        } else {
            return presetA.title.localeCompare(presetB.title);
        }
    });
    $: currentPresetIndex = presetList.findIndex((preset) => preset.key === currentPresetKey);

    $: presetActions = (() => {
        const actions: Record<string, () => void> = {};
        if (edited) {
            actions['Reset'] = () => {
                dispatchEvent('preset-selected', currentPresetKey);
            };
        }
        if (enablePresetExport) {
            actions['Export'] = () => {
                dispatchEvent('export');
            };
        }
        return actions;
    })() as Record<string, () => void>;
    const actionPostfix = ' Action'; // for option values, avoid collisions w/ preset keys

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

    function optionSelected(event: Event) {
        const selectedOption = event.target as HTMLOptionElement;
        const selectedValue = selectedOption.value;

        // If selected option is a preset action, trigger action and reset selection
        for (const actionLabel of Object.keys(presetActions)) {
            // Check with the postfix to avoid preset keys that match action labels
            if (selectedValue === actionLabel + actionPostfix) {
                presetActions[actionLabel]();
                presetSelector.selectedIndex = currentPresetIndex;
                return;
            }
        }

        // Otherwise, select the preset
        dispatchEvent('preset-selected', selectedOption.value);
    }
</script>

<div class="presets-wrapper" data-testid="presets-ui">
    <div class="preset-selector">
        <i
            class="fa fa-angle-left preset-button left"
            class:disabled={currentPresetIndex === 0}
            data-testid="previous-preset"
            on:click={previousPreset}
            on:keypress={previousPreset}
        />
        <select
            class="preset-select-element"
            data-testid="preset-select"
            bind:this={presetSelector}
            on:change={optionSelected}
        >
            {#each presetList as preset}
                <option
                    value={preset.key}
                    selected={preset.key === currentPresetKey}
                    data-testid="preset-option"
                >
                    {preset.title}
                    {#if edited && preset.key === currentPresetKey}*{/if}
                </option>
            {/each}
            {#if Object.keys(presetActions).length > 0}
                <option disabled>———</option>
                {#each Object.keys(presetActions) as action}
                    <option value={action + actionPostfix} data-testid={action}>
                        {action}
                    </option>
                {/each}
            {/if}
        </select>
        <i
            class="fa fa-angle-right preset-button right"
            class:disabled={currentPresetIndex === presetList.length - 1}
            data-testid="next-preset"
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
        user-select: none;

        @include mobile-mode {
            padding: 0;
        }
    }

    .preset-selector {
        @include preset-selector;

        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .preset-select-element {
        @include preset-select-element;

        flex-grow: 1;
        width: 100%;
        text-align: center;
        padding: $preset-selector-padding;

        // For Safari:
        text-align-last: center;
        border-radius: 0;
    }

    .preset-button {
        @include preset-button;

        flex-shrink: 0;
        height: 100%;
        display: grid;
        place-items: center;
        line-height: inherit; // Safari fix

        &.left {
            border-right: $preset-selector-inner-border-size solid
                rgba($panel-fg-color, $preset-selector-inner-border-opacity);
        }

        &.right {
            border-left: $preset-selector-inner-border-size solid
                rgba($panel-fg-color, $preset-selector-inner-border-opacity);
        }
    }
</style>
