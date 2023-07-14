<script lang="ts">
    import type { PageData } from './$types';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import CanvasViewer from '$lib/components/CanvasViewer.svelte';

    export let data: PageData;
</script>

<svelte:head>
    <title>{data.props.title}</title>
</svelte:head>

<CanvasViewer project={data.project} />
<ProjectDetailPanel projectTuple={data} />
