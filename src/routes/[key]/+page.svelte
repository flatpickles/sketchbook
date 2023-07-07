<script lang="ts">
    import type { PageData } from './$types';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';

    export let data: PageData;
    let canvasElement: HTMLCanvasElement;

    // Initialize and update the project when loading & changing projects
    $: {
        if (canvasElement) {
            data.project.canvas = canvasElement;
            data.project.init();
            data.project.update();
        }
    }
</script>

<svelte:head>
    <title>{data.props.title}</title>
</svelte:head>

<canvas class="main-canvas" bind:this={canvasElement} />

<ProjectDetailPanel projectTuple={data} />

<style lang="scss">
    .main-canvas {
        width: 100%;
        height: 100%;
    }
</style>
