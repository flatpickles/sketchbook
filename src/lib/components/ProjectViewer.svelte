<script lang="ts">
    import type Project from '$lib/base/Project/Project';
    import { CanvasType } from '$lib/base/Project/Project';
    import { ProjectConfigDefaults } from '$lib/base/ProjectConfig/ProjectConfig';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { onMount } from 'svelte';

    export let project: Project;
    export let containerResizing = false; // The container is being resized
    $: updateEachFrame = project.enableRenderLoop; // Update the project each frame

    let previousProject: Project | undefined;
    let canvasElement2D: HTMLCanvasElement;
    let canvasElementWebGL: HTMLCanvasElement;
    let containerElement: HTMLDivElement;

    // Local state used when updating project
    let frameCount = 0;
    let startTime = Date.now();
    let updatedParamKeys: string[] = [];
    let projectNeedsUpdate = false;

    // Called externally when the project's params are updated
    export function paramUpdated(event: CustomEvent) {
        const { updatedProject, paramKey } = event.detail;
        if (updatedProject != project)
            throw new Error('Updated project does not match current project');
        if (!updatedParamKeys.includes(paramKey)) updatedParamKeys.push(paramKey);
        projectNeedsUpdate = true;
    }

    // Update the project, component, and DOM state each frame / when appropriate
    const updateLoop = () => {
        if (containerElement) {
            const shouldUpdate = updateEachFrame || containerResizing || projectNeedsUpdate;
            if (containerResizing) setCanvasSize();
            if (shouldUpdate) {
                project.update({
                    frame: frameCount,
                    time: Date.now() - startTime,
                    paramKeys: updatedParamKeys
                });
                projectNeedsUpdate = false;
                frameCount += 1;
                updatedParamKeys = [];
            }
        }
        requestAnimationFrame(updateLoop);
    };
    updateLoop();

    /* Svelte events & reactivity */

    onMount(() => {
        // Update the canvas size whenever the window is resized
        window.addEventListener('resize', () => {
            setCanvasSize();
            projectNeedsUpdate = true;
        });
    });

    // Initialize and update the project when loading & changing projects
    $: {
        if (containerElement) projectLoaded(project);
    }

    // Reset the canvas size when the overlay configuration changes
    let panelsOverlaid = $settingsStore.overlayPanels;
    $: ((newPanelsValue: boolean) => {
        if (newPanelsValue !== panelsOverlaid) {
            setCanvasSize();
            projectNeedsUpdate = true;
            panelsOverlaid = newPanelsValue;
        }
    })($settingsStore.overlayPanels);

    /* Project & canvas management */

    // Called when the current `project` reference changes (i.e. a new project is loaded)
    function projectLoaded(newProject: Project) {
        if (!containerElement) {
            throw new Error("Cannot update a project when the container doesn't exist");
        }

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

        // Initialize the new project
        if (shouldResize) setCanvasSize();
        newProject.init();

        // Update component & DOM state
        fixP5Containment();
        frameCount = 0;
        startTime = Date.now();
        updatedParamKeys = [];
        projectNeedsUpdate = true;
    }

    // Called to reset the canvas size to match the container
    function setCanvasSize() {
        if (!containerElement)
            throw new Error("Cannot set canvas size when the container doesn't exist");
        const pixelRatio = window.devicePixelRatio;
        canvasElement2D.width = containerElement.clientWidth * pixelRatio;
        canvasElement2D.height = containerElement.clientHeight * pixelRatio;
        canvasElementWebGL.width = containerElement.clientWidth * pixelRatio;
        canvasElementWebGL.height = containerElement.clientHeight * pixelRatio;
    }

    // If a p5 canvas is present, position it within the parent container
    function fixP5Containment() {
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
        width: 100%;
        height: 100%;
    }

    .shared-canvas {
        width: 100%;
        height: 100%;

        &.hidden {
            display: none;
        }
    }
</style>
