<script lang="ts">
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let description: string | undefined = undefined;
</script>

<h1 data-testid="header-title">{title}</h1>
{#if subtitle}
    <h2 data-testid="header-subtitle">{@html subtitle}</h2>
{/if}
{#if description}
    <p data-testid="header-description">{@html description}</p>
{/if}
