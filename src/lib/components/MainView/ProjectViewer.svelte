<script lang="ts">
    import type Project from '$lib/base/Project/Project';
    import { CanvasType, type Detail } from '$lib/base/Project/Project';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { onMount } from 'svelte';

    export let project: Project;
    export let containerResizing = false;
    export let canvasSizeConfig: [number, number] | undefined = undefined;
    export let pixelRatioConfig: number | undefined = undefined;

    let previousProject: Project | undefined;
    let canvasElement2D: HTMLCanvasElement;
    let canvasElementWebGL: HTMLCanvasElement;
    let containerElement: HTMLDivElement;

    // Local state used when updating project
    let frameCount = 0;
    let startTime = Date.now();

    // Update the project, component, and DOM state each frame
    const updateLoop = () => {
        if (containerElement) {
            // Set the canvas size each frame if the container is actively resizing
            if (containerResizing) setCanvasSize();

            // Update the project, if update is implemented
            if (Object.getPrototypeOf(project).hasOwnProperty('update')) {
                project.update({
                    frame: frameCount,
                    time: Date.now() - startTime,
                    ...getCurrentDetail()
                });
                frameCount += 1;
            }
        }
        requestAnimationFrame(updateLoop);
    };
    updateLoop();

    function getCurrentDetail(): Detail<typeof project.canvasType> {
        // Get the current canvas & context references, depending on canvas type
        let currentCanvas = undefined;
        let currentContext = undefined;
        if (canvasElement2D && project.canvasType === CanvasType.Context2D) {
            currentCanvas = canvasElement2D;
            const context2D = canvasElement2D.getContext('2d');
            if (context2D) currentContext = context2D;
        } else if (canvasElementWebGL && project.canvasType === CanvasType.WebGL) {
            currentCanvas = canvasElementWebGL;
            const contextWebGL = canvasElementWebGL.getContext('webgl');
            if (contextWebGL) currentContext = contextWebGL;
        }

        // Return the detail object, for use with project lifecycle method calls
        return {
            container: containerElement,
            canvas: currentCanvas,
            context: currentContext
        };
    }

    /* Svelte events & reactivity */

    onMount(() => {
        // Update the canvas size whenever the window is resized
        window.addEventListener('resize', () => setCanvasSize());

        // Call the paramChanged project lifecycle method whenever a param is updated
        window.addEventListener('param-updated', (event) => {
            const customEvent = event as CustomEvent;
            project.paramChanged({
                paramKey: customEvent.detail.key,
                ...getCurrentDetail()
            });
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
            panelsOverlaid = newPanelsValue;
        }
    })($settingsStore.overlayPanels);

    /* Project & canvas management */

    // Called when the current `project` reference changes (i.e. a new project is loaded)
    function projectLoaded(newProject: Project) {
        if (!containerElement) {
            throw new Error("Cannot update a project when the container doesn't exist");
        }

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
        setCanvasSize(true);
        newProject.init();

        // Update component & DOM state
        fixP5Containment();
        frameCount = 0;
        startTime = Date.now();
    }

    // Called to reset the canvas size to the container size, or to a configured size
    function setCanvasSize(initializingProject = false) {
        if (!containerElement) {
            console.trace(); // todo: remove this (after debugging sporadic calls)
            throw new Error("Cannot set canvas size when the container doesn't exist");
        }

        const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;

        // If initializing the project, reset the shared canvas styles (in case set by last project)
        if (initializingProject) {
            canvasElement2D.removeAttribute('style');
            canvasElementWebGL.removeAttribute('style');

            // If the project configures a canvas size, set it
            if (canvasSizeConfig) {
                canvasElement2D.style.width = `${canvasSizeConfig[0] / pixelRatio}px`;
                canvasElement2D.style.height = `${canvasSizeConfig[1] / pixelRatio}px`;
                canvasElementWebGL.style.width = `${canvasSizeConfig[0] / pixelRatio}px`;
                canvasElementWebGL.style.height = `${canvasSizeConfig[1] / pixelRatio}px`;
            }
        }

        // Update the internal canvas sizes to match their style sizing
        const initialCanvasSize: [number, number] = [
            // these values are used if client sizes return 0, e.g. if display: none
            canvasSizeConfig ? canvasSizeConfig[0] : pixelRatio * containerElement.clientWidth,
            canvasSizeConfig ? canvasSizeConfig[1] : pixelRatio * containerElement.clientHeight
        ];
        canvasElement2D.width = canvasElement2D.clientWidth
            ? pixelRatio * canvasElement2D.clientWidth
            : initialCanvasSize[0];
        canvasElement2D.height = canvasElement2D.clientHeight
            ? pixelRatio * canvasElement2D.clientHeight
            : initialCanvasSize[1];
        canvasElementWebGL.width = canvasElementWebGL.clientWidth
            ? pixelRatio * canvasElementWebGL.clientWidth
            : initialCanvasSize[0];
        canvasElementWebGL.height = canvasElementWebGL.clientHeight
            ? pixelRatio * canvasElementWebGL.clientHeight
            : initialCanvasSize[1];

        // Call the project's resize method (if not initializing)
        if (initializingProject) return;
        const containerSize: [number, number] = [
            containerElement.clientWidth,
            containerElement.clientHeight
        ];
        const canvasSize: [number, number] | undefined =
            project.canvasType == CanvasType.Context2D
                ? [canvasElement2D.width, canvasElement2D.height]
                : project.canvasType == CanvasType.WebGL
                ? [canvasElementWebGL.width, canvasElementWebGL.height]
                : undefined;
        project.resized({ containerSize, canvasSize, ...getCurrentDetail() });
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
        data-testid="shared-canvas-2D"
        bind:this={canvasElement2D}
        class:hidden={project.canvasType !== CanvasType.Context2D}
    />
    <canvas
        class="shared-canvas"
        data-testid="shared-canvas-WebGL"
        bind:this={canvasElementWebGL}
        class:hidden={project.canvasType !== CanvasType.WebGL}
    />
</div>

<style lang="scss">
    :global(canvas) {
        background-color: $canvas-bg-color;
        box-shadow: $canvas-shadow;
    }

    #container {
        width: 100%;
        height: 100%;
        background-color: $container-bg-color;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shared-canvas {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;

        &.hidden {
            display: none;
        }
    }
</style>
