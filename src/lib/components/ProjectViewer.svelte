<script lang="ts">
    import type Project from '$lib/base/Project/Project';
    import { CanvasType } from '$lib/base/Project/Project';
    import { onMount } from 'svelte';

    export let project: Project;
    let previousProject: Project | undefined;
    let canvasElement2D: HTMLCanvasElement;
    let canvasElementWebGL: HTMLCanvasElement;
    let containerElement: HTMLDivElement;

    onMount(() => {
        // Update the canvas size whenever the window is resized
        window.addEventListener('resize', () => {
            setCanvasSize();
            project.update();
        });
    });

    // Initialize and update the project when loading & changing projects
    $: {
        if (containerElement) {
            projectUpdated(project);
        }
    }

    function projectUpdated(newProject: Project) {
        // When loading a first project or changing the canvas type, resize the canvas
        const shouldResize =
            !previousProject || previousProject.canvasType !== newProject.canvasType;

        // Track the previous project so we can destroy it
        previousProject?.destroy();
        previousProject = newProject;

        // Destroy previous non-shared contents of the canvas container
        for (const child of containerElement.children) {
            if (child !== canvasElement2D && child !== canvasElementWebGL) {
                containerElement.removeChild(child);
            }
        }

        // Assign the canvas reference if the project uses a shared canvas
        newProject.container = containerElement;
        newProject.canvas =
            newProject.canvasType === CanvasType.Context2D
                ? canvasElement2D
                : newProject.canvasType === CanvasType.WebGL
                ? canvasElementWebGL
                : undefined;

        // Initialize and update the new project
        if (shouldResize) setCanvasSize();
        newProject.init();
        fixP5Containment();
        newProject.update();
    }

    function setCanvasSize() {
        // todo: optional 2x resolution
        // todo: tests for canvas sizing behavior?
        // todo: clears canvas - not desired?

        // canvasElement.clientSize can be 0 (when display is none), so use container size instead
        canvasElement2D.width = containerElement.clientWidth * 2;
        canvasElement2D.height = containerElement.clientHeight * 2;
        canvasElementWebGL.width = containerElement.clientWidth * 2;
        canvasElementWebGL.height = containerElement.clientHeight * 2;
    }

    function fixP5Containment() {
        // If a p5 canvas is present, position it within the parent container
        const p5Canvas = document.querySelector('.p5Canvas');
        if (p5Canvas) {
            p5Canvas.remove();
            containerElement.appendChild(p5Canvas);
        }
    }
</script>

<div id="container" data-testid="container" bind:this={containerElement}>
    <canvas
        class="shared-canvas"
        data-testid="shared-canvas"
        bind:this={canvasElement2D}
        class:hidden={project.canvasType !== CanvasType.Context2D}
    />
    <canvas
        class="shared-canvas"
        data-testid="shared-canvas"
        bind:this={canvasElementWebGL}
        class:hidden={project.canvasType !== CanvasType.WebGL}
    />
</div>

<style lang="scss">
    #container {
        display: block;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .shared-canvas {
        width: 100%;
        height: 100%;

        &.hidden {
            display: none;
        }
    }
</style>
