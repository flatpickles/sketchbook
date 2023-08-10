<script lang="ts">
    import type Project from '$lib/base/Project';
    import { onMount } from 'svelte';

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

    onMount(() => {
        // Update the canvas size after the DOM has loaded, and whenever the window is resized
        // todo: flash of canvas before properly sized; maybe just hide it until we size it?
        setTimeout(setCanvasSize, 0);
        window.addEventListener('resize', () => {
            setCanvasSize();
            project.update();
        });
    });

    function setCanvasSize() {
        // todo: optional 2x resolution
        // todo: tests for canvas sizing behavior?
        // todo: clears canvas - not desired?
        canvasElement.width = canvasElement.clientWidth * 2;
        canvasElement.height = canvasElement.clientHeight * 2;
    }
</script>

<canvas class="main-canvas" data-testid="main-canvas" bind:this={canvasElement} />

<style lang="scss">
    .main-canvas {
        display: block;
        width: 100vw;
        height: 100vh;
    }
</style>
