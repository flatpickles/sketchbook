<script lang="ts">
    import OGContentGen from '$lib/base/Util/OGContentProvider';
    import ProjectContent from '$lib/components/MainView/ProjectContent.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    $: ogMeta = OGContentGen.project(data.requestUrl, data.projectKey, data.projectConfig);
</script>

<svelte:head>
    <title>{data.projectConfig.title}</title>

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
    {#if ogMeta.author}
        <meta property="article:author" content={ogMeta.author} />
    {/if}
    {#if data.projectConfig.date}
        <meta property="og:updated_time" content={data.projectConfig.date?.toISOString()} />
        <meta property="article:updated_time" content={data.projectConfig.date?.toISOString()} />
    {/if}
</svelte:head>

{#if data.projectTuple}
    <ProjectContent projectTuple={data.projectTuple} />
{/if}
