<script lang="ts">
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let description: string | undefined = undefined;
</script>

<div class="header-wrapper">
    <div class="header-top">
        <div class="header-lede">
            <h1 data-testid="header-title">{title}</h1>
            {#if subtitle}
                <h2 data-testid="header-subtitle">{@html subtitle}</h2>
            {/if}
        </div>
        <button class="header-button"><i class="fa fa-close" /></button>
    </div>

    {#if description}
        <p data-testid="header-description">{@html description}</p>
    {/if}
</div>

<style lang="scss">
    .header-wrapper {
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
        @include header-button;
        flex-shrink: 0;
    }

    h1 {
        @include title-text;
        padding: $panel-content-inset $panel-content-inset 0;
    }

    h2 {
        @include subtitle-text;
        padding: 0 $panel-content-inset;
    }

    p {
        @include description-text;
        padding: 0 $panel-content-inset;
    }
</style>
