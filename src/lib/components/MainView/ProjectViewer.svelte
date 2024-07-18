<script lang="ts">
    import type Project from '$lib/base/Project/Project';
    import { CanvasType, type Detail } from '$lib/base/Project/Project';
    import { frameRecorderStore, settingsStore } from '$lib/base/Util/AppState';
    import { CanvasRecorder } from '$lib/base/Util/CanvasRecorder';
    import { FrameRecorder } from '$lib/base/Util/FrameRecorder';
    import { getContext, onDestroy, onMount } from 'svelte';

    export let project: Project;
    export let staticMode = false;
    export let containerResizing = false;
    export let canvasSizeConfig: [number, number] | undefined = undefined;
    export let pixelRatioConfig: number | undefined = undefined;

    const canvasRecorder: CanvasRecorder | undefined = getContext('canvasRecorder');
    const frameRecorder: FrameRecorder | undefined = getContext('frameRecorder');

    let previousProject: Project | undefined;
    let containerElement: HTMLDivElement;
    let currentCanvas: HTMLCanvasElement | undefined;
    let currentContext: RenderingContext | null | undefined;

    // Local state used when updating project
    let frameCount = 0;
    let startTime = performance.now();
    let paramsChanged = new Set<string>();

    // Framerate control variables
    let lastFrameTime = 0;
    let updateLoopID: number | undefined = undefined;
    $: frameInterval = 1000 / $settingsStore.framerate;

    let frameRecorderTime = 0;
    $: frameRecordInterval = 1000 / $frameRecorderStore.fps;

    const updateLoop = (timestamp: number) => {
        if (containerElement) {
            // Set the canvas size each frame if the container is actively resizing
            if (containerResizing) setCanvasSize();

            // Update the project, if not in static mode
            if (frameRecorder && frameRecorder.isRecording) {
                updateProject(frameRecorderTime / 1000);
                frameRecorder.recordFrame();
                frameRecorderTime += frameRecordInterval;
            } else if (!staticMode) {
                updateProject((performance.now() - startTime) / 1000);
            }

            // todo fps controls mostly removed, finish that
            // if (!staticMode) {
            //     const elapsed = timestamp - lastFrameTime;
            //     if (elapsed >= frameInterval) {
            //         updateProject((performance.now() - startTime) / 1000);
            //         lastFrameTime = timestamp;
            //     }
            // }
        }
        updateLoopID = requestAnimationFrame(updateLoop);
    };

    function configureFrameRecorder() {
        // todo: what happens if projects change?
        if (frameRecorder) {
            frameRecorder.onStart(() => {
                if (staticMode) {
                    alert('Frame sequence recording not supported in static mode');
                    frameRecorder.cancelRecording();
                    return;
                }

                // Reload project & setup recording
                projectLoaded(project);
                frameRecorderTime = $frameRecorderStore.startTimeMs;
            });
            frameRecorder.onStop((success: boolean) => {
                if (success) {
                    projectLoaded(project);
                }
                // on no success wassup?
            });
        }
    }

    function getCurrentDetail(): Detail<typeof project.canvasType> {
        // Return the detail object, for use with project lifecycle method calls
        return {
            container: containerElement,
            canvas: currentCanvas,
            context: currentContext
        };
    }

    // Derive canvas size from project config + settings
    let useFullscreenCanvas = $settingsStore.useFullscreenCanvas;
    let defaultCanvasSize = $settingsStore.defaultCanvasSize;
    let derivedCanvasSize: [number, number] | undefined = undefined;
    settingsStore.subscribe((settings) => {
        useFullscreenCanvas = settings.useFullscreenCanvas;
        defaultCanvasSize = settings.defaultCanvasSize;
        derivedCanvasSize =
            canvasSizeConfig ??
            ((useFullscreenCanvas ? undefined : defaultCanvasSize) as [number, number] | undefined);

        // Update the current canvas size
        if (currentCanvas) {
            if (derivedCanvasSize) {
                const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;
                currentCanvas.style.width = `${derivedCanvasSize[0] / pixelRatio}px`;
                currentCanvas.style.height = `${derivedCanvasSize[1] / pixelRatio}px`;
            } else {
                currentCanvas.style.width = '';
                currentCanvas.style.height = '';
            }
            setCanvasSize();
        }
    });

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
            if (staticMode) updateProject(0);
        });

        // Update the canvas size whenever the window is resized
        window.addEventListener('resize', () => setCanvasSize());

        // Track canvas recording state
        configureFrameRecorder();
    });

    // Destroy the project when destroying the component (e.g. hot update)
    onDestroy(() => {
        if (updateLoopID) cancelAnimationFrame(updateLoopID);
        destroyPreviousProject();
        if (canvasRecorder) canvasRecorder.canvas = undefined;
        if (frameRecorder) frameRecorder.canvas = undefined;
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
            if (canvasRecorder) canvasRecorder.canvas = currentCanvas;
            if (frameRecorder) frameRecorder.canvas = currentCanvas;

            // Set canvas element size, if configured
            if (derivedCanvasSize) {
                const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;
                currentCanvas.style.width = `${derivedCanvasSize[0] / pixelRatio}px`;
                currentCanvas.style.height = `${derivedCanvasSize[1] / pixelRatio}px`;
            }

            // Add the canvas to the container
            containerElement.appendChild(currentCanvas);
        } else {
            if (canvasRecorder) canvasRecorder.canvas = undefined;
            if (frameRecorder) frameRecorder.canvas = undefined;
        }
    }

    // Called to update the project, bumping the frame count
    function updateProject(time: number) {
        const currentDetail = getCurrentDetail();
        project.update({
            ...currentDetail,
            frame: frameCount,
            time,
            width: currentDetail.canvas?.width,
            height: currentDetail.canvas?.height,
            paramsChanged: Array.from(paramsChanged)
        });
        frameCount += 1;
        paramsChanged.clear();
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
        startTime = performance.now();
        paramsChanged.clear();

        // Start the update loop after first project load, and call update for static projects
        if (!updateLoopID) updateLoopID = requestAnimationFrame(updateLoop);
        if (staticMode) updateProject(0);
    }

    // Called to reset the canvas size to the container size, or to a configured size
    function setCanvasSize(initializingProject = false) {
        if (!containerElement) return;

        // Update the internal canvas size to match the element size
        if (currentCanvas) {
            const pixelRatio = pixelRatioConfig ?? window.devicePixelRatio;
            const initialCanvasSize: [number, number] = [
                // these values are used if client sizes return 0, e.g. if display: none
                derivedCanvasSize
                    ? derivedCanvasSize[0]
                    : pixelRatio * containerElement.clientWidth,
                derivedCanvasSize
                    ? derivedCanvasSize[1]
                    : pixelRatio * containerElement.clientHeight
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
        if (staticMode) updateProject((performance.now() - startTime) / 1000);
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
