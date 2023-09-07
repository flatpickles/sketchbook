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
        margin: 0 0 calc($panel-header-section-spacing / 2) calc($panel-header-section-spacing / 2);
        border: $panel-outline;
        border-style: none none solid solid;
        border-radius: 0 0 0 $panel-border-radius;
    }

    h1 {
        @include title-text;
        padding: $panel-content-inset $panel-content-inset 0;
    }

    h2 {
        @include subtitle-text;
        padding: calc($panel-header-section-spacing / 4) $panel-content-inset 0 $panel-content-inset;
    }

    p {
        @include description-text;
        padding: 0 $panel-content-inset;
    }
</style>
