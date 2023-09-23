<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let description: string | undefined = undefined;
    export let headerButtonIcon: string | undefined = undefined;

    const dispatch = createEventDispatcher();
    function buttonClicked() {
        dispatch('headeraction');
    }
</script>

<div class="header-wrapper">
    <div class="header-top">
        <div class="header-lede">
            <h1 data-testid="header-title">{title}</h1>
            {#if subtitle}
                <h2 data-testid="header-subtitle">{@html subtitle}</h2>
            {/if}
        </div>
        {#if headerButtonIcon != undefined}
            <button class="header-button" data-testid="right-header-button" on:click={buttonClicked}
                ><i class={`fa ${headerButtonIcon}`} /></button
            >
        {/if}
    </div>

    {#if description}
        <p data-testid="header-description">{@html description}</p>
    {/if}
</div>

<style lang="scss">
    .header-wrapper {
        flex-shrink: 0;
        margin-bottom: calc($panel-section-spacing / 2);

        display: flex;
        flex-direction: column;
        gap: $panel-header-section-spacing;
    }

    .header-top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: $panel-header-section-spacing;
    }

    .header-button {
        @include panel-button;
        flex-shrink: 0;
    }

    @if ($panel-button-inset-zero) {
        // No configured inset, configure borders & margins accordingly
        .header-button {
            border-style: none none solid solid;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            margin-bottom: calc($panel-header-section-spacing / 2);
            margin-left: calc($panel-header-section-spacing / 2);
        }
    }

    h1 {
        @include title-text;
        margin: $panel-content-inset $panel-content-inset 0;
    }

    h2 {
        @include subtitle-text;
        margin: calc($panel-header-section-spacing / 4) $panel-content-inset 0 $panel-content-inset;
    }

    p {
        @include description-text;
        margin: 0 $panel-content-inset;
    }
</style>
