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
    let containerElement: HTMLDivElement;
    let currentCanvas: HTMLCanvasElement | undefined;
    let currentContext: RenderingContext | null | undefined;

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
    onDestroy(destroyPreviousProject);

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

    // Called to create a new canvas in the DOM, and update the current canvas & context references
    function createCanvas(canvasType: CanvasType) {
        // Unset current references
        currentCanvas = undefined;
        currentContext = undefined;

        // Create a new canvas for the project when appropriate
        if (canvasType !== CanvasType.None) {
            currentCanvas = document.createElement('canvas');
            currentCanvas.classList.add('project-canvas');
            currentCanvas.setAttribute('data-testid', 'project-canvas');
            if (canvasType !== CanvasType.Unknown) {
                currentContext = currentCanvas.getContext(project.canvasType as string);
            }

            // Set canvas element size, if configured
            if (canvasSizeConfig) {
                const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;
                currentCanvas.style.width = `${canvasSizeConfig[0] / pixelRatio}px`;
                currentCanvas.style.height = `${canvasSizeConfig[1] / pixelRatio}px`;
            }

            // Add the canvas to the container
            containerElement.appendChild(currentCanvas);
        }
    }

    // Called when a new project is loaded, or when the component is destroyed
    function destroyPreviousProject() {
        previousProject?.destroy(getCurrentDetail());

        // Destroy all previous contents of the container
        for (const child of containerElement.children) {
            containerElement.removeChild(child);
        }
    }

    // Called when the current `project` reference changes (i.e. a new project is loaded)
    function projectLoaded(newProject: Project) {
        if (!containerElement) {
            throw new Error("Cannot update a project when the container doesn't exist");
        }

        // Destroy and reset the previous project
        destroyPreviousProject();
        previousProject = newProject;

        // Create a new canvas for the project (updates currentCanvas & currentContext)
        createCanvas(newProject.canvasType);

        // Assign the canvas reference if the project uses a shared canvas
        newProject.container = containerElement;
        newProject.canvas = currentCanvas;

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

        // Update the internal canvas size to match the element size
        if (currentCanvas) {
            const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;
            const initialCanvasSize: [number, number] = [
                // these values are used if client sizes return 0, e.g. if display: none
                canvasSizeConfig ? canvasSizeConfig[0] : pixelRatio * containerElement.clientWidth,
                canvasSizeConfig ? canvasSizeConfig[1] : pixelRatio * containerElement.clientHeight
            ];
            currentCanvas.width = currentCanvas.clientWidth
                ? pixelRatio * currentCanvas.clientWidth
                : initialCanvasSize[0];
            currentCanvas.height = currentCanvas.clientHeight
                ? pixelRatio * currentCanvas.clientHeight
                : initialCanvasSize[1];
        }

        // Call the project's resize method (if not initializing)
        if (initializingProject) return;
        const containerSize: [number, number] = [
            containerElement.clientWidth,
            containerElement.clientHeight
        ];
        const canvasSize: [number, number] | undefined = currentCanvas
            ? [currentCanvas.width, currentCanvas.height]
            : undefined;
        project.resized({ containerSize, canvasSize, ...getCurrentDetail() });
        if (staticMode) updateProject();
    }
</script>

<div id="container" data-testid="container" bind:this={containerElement} />

<style lang="scss">
    #container {
        width: 100%;
        height: 100%;
        background-color: $container-bg-color;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.project-canvas) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;

        background-color: $canvas-bg-color;
        box-shadow: $canvas-shadow;
    }
</style>
