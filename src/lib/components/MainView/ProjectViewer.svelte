<script lang="ts">
    import type Project from '$lib/base/Project/Project';
    import { CanvasType, type Detail } from '$lib/base/Project/Project';
    import { settingsStore } from '$lib/base/Util/AppState';
    import { onDestroy, onMount } from 'svelte';

    export let project: Project;
    export let staticMode = false;
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
    let paramsChanged = new Set<string>();

    // Call the update function each frame when not in static mode
    let updateLoopID: number | undefined = undefined;
    const updateLoop = () => {
        if (containerElement) {
            // Set the canvas size each frame if the container is actively resizing
            if (containerResizing) setCanvasSize();

            // Update the project, if not in static mode
            if (!staticMode) updateProject();
        }
        updateLoopID = requestAnimationFrame(updateLoop);
    };

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
        // Call the paramsChanged project lifecycle method whenever a param is updated
        window.addEventListener('params-changed', (event) => {
            const customEvent = event as CustomEvent;
            project.paramsChanged({
                keys: customEvent.detail,
                ...getCurrentDetail()
            });
            for (let key of customEvent.detail) paramsChanged.add(key);
            if (staticMode) updateProject();
        });

        // Update the canvas size whenever the window is resized
        window.addEventListener('resize', () => setCanvasSize());
    });

    // Destroy the project when destroying the component (e.g. hot update)
    onDestroy(destroyProject);

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

    // Called to update the project, bumping the frame count and calculating the time
    function updateProject() {
        const currentDetail = getCurrentDetail();
        project.update({
            ...currentDetail,
            frame: frameCount,
            time: (Date.now() - startTime) / 1000,
            width: currentDetail.canvas?.width,
            height: currentDetail.canvas?.height,
            paramsChanged: Array.from(paramsChanged)
        });
        frameCount += 1;
        paramsChanged.clear();
    }

    // Called when a new project is loaded, or when the component is destroyed
    function destroyProject() {
        // Destroy the previousProject (not project, so it's safe to call this from projectLoaded)
        previousProject?.destroy(getCurrentDetail());
        previousProject = undefined;

        // Destroy previous non-shared contents of the canvas container
        for (const child of containerElement.children) {
            if (child !== canvasElement2D && child !== canvasElementWebGL) {
                containerElement.removeChild(child);
            }
        }
    }

    // Called when the current `project` reference changes (i.e. a new project is loaded)
    function projectLoaded(newProject: Project) {
        if (!containerElement) {
            throw new Error("Cannot update a project when the container doesn't exist");
        }

        // Destroy the previous project, and track the new project for future destruction
        destroyProject();
        previousProject = newProject;

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
        newProject.init(getCurrentDetail());

        // Update component state
        frameCount = 0;
        startTime = Date.now();
        paramsChanged.clear();

        // Start the update loop after first project load, and call update for static projects
        if (!updateLoopID) updateLoop();
        if (staticMode) updateProject();
    }

    // Called to reset the canvas size to the container size, or to a configured size
    function setCanvasSize(initializingProject = false) {
        if (!containerElement) return;
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
        if (staticMode) updateProject();
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
