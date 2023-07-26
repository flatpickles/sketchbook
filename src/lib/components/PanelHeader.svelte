<script lang="ts">
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let description: string | undefined = undefined;
</script>

<div class="header-lede">
    <h1 data-testid="header-title">{title}</h1>
    {#if subtitle}
        <h2 data-testid="header-subtitle">{@html subtitle}</h2>
    {/if}
</div>

{#if description}
    <p data-testid="header-description">{@html description}</p>
{/if}

<style lang="scss">
    h1 {
        font-size: $title-font-size;
    }

    h2 {
        font-size: $subtitle-font-size;
    }

    p {
        font-size: $description-font-size;
    }
</style>
