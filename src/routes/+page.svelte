<script lang="ts">
    import { content } from '$config/content';
    import OGContentGen from '$lib/base/Util/OGContentProvider';
    import type { PageData } from './$types';

    export let data: PageData;
    const ogMeta = OGContentGen.top(data.requestUrl);
</script>

<svelte:head>
    <title>{content.title}</title>

    <meta property="og:title" content={ogMeta.title} />
    <meta name="twitter:title" content={ogMeta.title} />
    <meta property="og:site_name" content={ogMeta.siteName} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={ogMeta.url} />
    {#if ogMeta.locale}
        <meta property="og:locale" content={ogMeta.locale} />
    {/if}
    {#if ogMeta.description}
        <meta property="og:description" content={ogMeta.description} />
        <meta name="twitter:description" content={ogMeta.description} />
    {/if}
    {#if ogMeta.image}
        <meta property="og:image" content={ogMeta.image} />
        <meta name="twitter:image" content={ogMeta.image} />
        <meta name="twitter:card" content="summary_large_image" />
    {:else}
        <meta name="twitter:card" content="summary" />
    {/if}
</svelte:head>
