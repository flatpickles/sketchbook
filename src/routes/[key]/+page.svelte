<script lang="ts">
    import type { PageData } from './$types';
    import CanvasViewer from '$lib/components/CanvasViewer.svelte';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import ProjectListPanel from '$lib/components/ProjectListPanel.svelte';

    export let data: PageData;
</script>

<svelte:head>
    <title>{data.props.title}</title>
</svelte:head>

<ProjectListPanel
    projects={data.projects}
    sketchbookConfig={data.sketchbook}
    selectedProjectKey={data.projectKey}
/>
<CanvasViewer project={data.project} />
<ProjectDetailPanel projectTuple={data} />
