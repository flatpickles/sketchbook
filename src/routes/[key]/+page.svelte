<script lang="ts">
    import type { PageData } from './$types';
    import ProjectDetailPanel from '$lib/components/ProjectDetailPanel.svelte';
    import type Project from '$lib/base/Project';

    export let data: PageData;
    let canvasElement: HTMLCanvasElement;
    let previousProject: Project | undefined;

    // Initialize and update the project when loading & changing projects
    $: {
        if (canvasElement) {
            // Track the previous project so we can destroy it
            previousProject?.destroy();
            previousProject = data.project;
            // Initialize the new project
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
