<script lang="ts">
    import type { PageData } from './$types';
    import ProjectViewer from '$lib/components/ProjectViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    export let data: PageData;
</script>

<svelte:head>
    <title>{data.projectTuple.props.title}</title>
</svelte:head>

<ProjectListPanel projects={data.projects} selectedProjectKey={data.projectKey} />
<ProjectViewer project={data.projectTuple.project} />
<ProjectDetailPanel projectTuple={data.projectTuple} />
