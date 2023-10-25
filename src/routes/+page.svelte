<script lang="ts">
    import { content } from '$config/content';
    import OGContentGen from '$lib/base/Util/OGContentGen';
    const ogMeta = OGContentGen.top();
</script>

<svelte:head>
    <title>{content.title}</title>

    <meta property="og:title" content={ogMeta.title} />
    <meta property="og:site_name" content={ogMeta.siteName} />
    <meta property="og:locale" content={ogMeta.locale} />
    <meta property="og:type" content="article" />
    {#if ogMeta.description}
        <meta property="og:description" content={ogMeta.description} />
    {/if}
    {#if ogMeta.image}
        <meta property="og:image" content={ogMeta.image} />
    {/if}
    {#if ogMeta.url}
        <meta property="og:url" content={ogMeta.url} />
    {/if}
</svelte:head>
