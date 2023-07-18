<script lang="ts">
    export let title: string;
    export let subtitle: string | undefined = undefined;
    export let description: string | undefined = undefined;
</script>

<h1>{title}</h1>
{#if subtitle}
    <h2>{@html subtitle}</h2>
{/if}
{#if description}
    <p>{@html description}</p>
{/if}
