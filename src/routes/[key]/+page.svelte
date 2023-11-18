<script lang="ts">
    import OGContentGen from '$lib/base/Util/OGContentProvider';
    import ProjectContent from '$lib/components/MainView/ProjectContent.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    $: ogMeta = OGContentGen.project(data.requestUrl, data.projectKey, data.projectConfig);

    // Generate schema.org markup for the project
    $: schemaMarkup = {
        '@context': 'http://schema.org',
        '@type': 'CreativeWork',
        'name': `${ogMeta.title}`
    } as Record<string, string>;
    $: if (ogMeta.description) {
        schemaMarkup['description'] = ogMeta.description;
    }
    $: if (data.projectConfig.date) {
        schemaMarkup['dateCreated'] = data.projectConfig.date.toISOString().split('T')[0];
    }
    $: if (ogMeta.author) {
        schemaMarkup['creator'] = ogMeta.author;
    }
</script>

<svelte:head>
    <!-- Metadata -->
    <title>{data.projectConfig.title}</title>
    {#if ogMeta.description}
        <meta name="description" content={ogMeta.description} />
    {/if}
    <link rel="canonical" href={ogMeta.url} />

    <!-- Open Graph / Facebook / Twitter -->
    <meta property="og:title" content={ogMeta.title} />
    <meta name="twitter:title" content={ogMeta.title} />
    <meta property="og:site_name" content={ogMeta.siteName} />
    <meta property="og:type" content="article" />
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
    {#if ogMeta.author}
        <meta property="article:author" content={ogMeta.author} />
    {/if}
    {#if ogMeta.publishedTime}
        <meta property="article:published_time" content={ogMeta.publishedTime} />
    {/if}

    <!-- Schema.org -->
    {@html `<script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>`}
</svelte:head>

{#if data.projectTuple}
    <ProjectContent projectTuple={data.projectTuple} />
{/if}
