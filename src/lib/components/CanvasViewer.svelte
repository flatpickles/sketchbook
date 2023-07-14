<script lang="ts">
    import type Project from '$lib/base/Project';

    export let project: Project;
    let previousProject: Project | undefined;
    let canvasElement: HTMLCanvasElement;

    // Initialize and update the project when loading & changing projects
    $: {
        if (canvasElement) {
            // Track the previous project so we can destroy it
            previousProject?.destroy();
            previousProject = project;
            // Initialize the new project
            project.canvas = canvasElement;
            project.init();
            project.update();
        }
    }
</script>

<canvas class="main-canvas" data-testid="main-canvas" bind:this={canvasElement} />

<style lang="scss">
    .main-canvas {
        width: 100%;
        height: 100%;
    }
</style>
