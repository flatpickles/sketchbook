<script lang="ts">
    import OGContentGen from '$lib/base/Util/OGContentGen';
    import ProjectContent from '$lib/components/MainView/ProjectContent.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    $: ogMeta = OGContentGen.project(data.projectTuple.key, data.projectTuple.config);
</script>

<svelte:head>
    <title>{data.projectTuple.config.title}</title>

    <meta property="og:title" content={ogMeta.title} />
    <meta property="og:site_name" content={ogMeta.siteName} />
    <meta property="og:type" content="article" />
    {#if ogMeta.locale}
        <meta property="og:locale" content={ogMeta.locale} />
    {/if}
    {#if ogMeta.description}
        <meta property="og:description" content={ogMeta.description} />
    {/if}
    {#if ogMeta.image}
        <meta property="og:image" content={ogMeta.image} />
    {/if}
    {#if ogMeta.url}
        <meta property="og:url" content={ogMeta.url} />
    {/if}
    {#if data.projectTuple.config.date}
        <meta
            property="article:updated_time"
            content={data.projectTuple.config.date?.toISOString()}
        />
    {/if}
    {#if ogMeta.author}
        <meta property="article:author" content={ogMeta.author} />
    {/if}
</svelte:head>

<ProjectContent projectTuple={data.projectTuple} />
