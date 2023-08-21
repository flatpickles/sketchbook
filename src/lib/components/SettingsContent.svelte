<script lang="ts">
    import ParamItem from './ParamItem/ParamItem.svelte';
    import { ParamType, type ParamConfig } from '$lib/base/ParamConfig/ParamConfig';
    import {
        NumberParamStyle,
        type NumberParamConfig
    } from '$lib/base/ParamConfig/NumberParamConfig';

    const settingsParams: ParamConfig[] = [
        {
            type: ParamType.Number,
            key: 'testNumber',
            name: 'Test Number',
            liveUpdates: true,
            min: 0,
            max: 100,
            step: 1,
            style: NumberParamStyle.Combo
        } as NumberParamConfig
    ];
</script>

<div class="settings-grid">
    {#each settingsParams as param, i}
        <ParamItem
            config={param}
            value={3}
            even={i % 2 === 0}
            disabled={false}
            on:update={undefined}
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
</style>
