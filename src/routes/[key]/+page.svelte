<script lang="ts">
    import type { PageData } from './$types';
    import MainView from '$lib/components/MainView/MainView.svelte';

    export let data: PageData;
</script>

<svelte:head>
    <title>{data.projectTuple.config.title}</title>
</svelte:head>

<MainView projectConfigs={data.projects} selectedProjectTuple={data.projectTuple} />
