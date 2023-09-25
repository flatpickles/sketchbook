<script lang="ts">
    import ProjectContent from '$lib/components/MainView/ProjectContent.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<svelte:head>
    <title>{data.projectTuple.config.title}</title>
</svelte:head>

<ProjectContent projectTuple={data.projectTuple} />
