/* eslint-disable @typescript-eslint/no-explicit-any */

import Project, { CanvasType } from '$lib/base/Project/Project';
import ProjectViewer from '$lib/components/MainView/ProjectViewer.svelte';

import P5Project from '$lib/base/Project/P5Project';
import { captureControlStore, settingsStore } from '$lib/base/Util/AppState';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi, type Mock } from 'vitest';

//p5 throws errors when running in unit tests, so we mock it out fully.
// This precludes more rigorous DOM testing, but it's better than nothing.
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
import * as exportsP5 from 'p5';
import { get } from 'svelte/store';
const mockedP5: Mock = vi.spyOn(exportsP5, 'default');
const mockP5Canvas = {
    parent: vi.fn()
};
const mockP5Object = {
    draw: vi.fn(),
    setup: vi.fn(),
    createCanvas: () => {
        return mockP5Canvas;
    },
    remove: vi.fn(),
    mouseClicked: vi.fn()
};
mockedP5.mockImplementation(() => {
    return mockP5Object;
});

// Mocking for getContext is required for HTMLCanvasElement to work with Jest/Vitest
// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;

class BasicProject extends Project {}

class Project3D extends Project {
    canvasType = CanvasType.WebGL;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update() {}
}

class ProjectNoCanvas extends Project {
    canvasType = CanvasType.None;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update() {}
}

describe('ProjectViewer', () => {
    afterEach(cleanup);

    it('renders a canvas', async () => {
        const { getByTestId } = render(ProjectViewer, {
            project: new BasicProject()
        });

        const canvas = getByTestId('project-canvas');
        expect(canvas).toBeDefined();
    });

    it('inits and updates a project when rendering (2D context)', async () => {
        const proj = new BasicProject();
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });
        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        const container = getByTestId('container');

        expect(proj.init).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null // null during testing, alas
        });

        await waitFor(() => expect(proj.update).toHaveBeenCalled());
    });

    it('inits and updates a project when rendering (WebGL context)', async () => {
        const proj = new BasicProject();
        proj.canvasType = CanvasType.WebGL;
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        expect(proj.init).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null // null during testing, alas
        });

        await waitFor(() => expect(proj.update).toHaveBeenCalled());
    });

    it('inits and updates a project when rendering (WebGL2 context)', async () => {
        const proj = new BasicProject();
        proj.canvasType = CanvasType.WebGL2;
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        expect(proj.init).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null // null during testing, alas
        });

        await waitFor(() => expect(proj.update).toHaveBeenCalled());
    });

    it('inits and updates a project when rendering (Unknown context)', async () => {
        const proj = new BasicProject();
        proj.canvasType = CanvasType.Unknown;
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { component, getByTestId } = render(ProjectViewer, {
            project: proj
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        // Context should be undefined (not null) for unknown canvas types
        expect(proj.init).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: undefined
        });

        // Context should be undefined (not null) for unknown canvas types
        expect(component.currentContext).toBeUndefined();

        await waitFor(() => expect(proj.update).toHaveBeenCalled());
    });

    it('does not create a canvas for CanvasType none', async () => {
        const proj = new BasicProject();
        proj.canvasType = CanvasType.None;

        const { queryByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas = queryByTestId('project-canvas');
        expect(canvas).toBeNull();
    });

    it('defines canvas and container objects for the project when rendering', async () => {
        const proj = new BasicProject();
        expect(proj.canvas).toBeUndefined();
        render(ProjectViewer, {
            project: proj
        });
        expect(proj.canvas).toBeDefined();
        expect(proj.container).toBeDefined();
    });

    it('destroys an old project when rendering a new one', async () => {
        const proj1 = new BasicProject();
        vi.spyOn(proj1, 'destroy');

        const { component, getByTestId } = render(ProjectViewer, {
            project: proj1
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        component.project = new BasicProject();
        expect(proj1.destroy).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null // null during testing, alas
        });
    });

    it('resets local state (for update) when loading a new BasicProject', async () => {
        let lastTime = 0;
        let lastFrame = 0;

        const proj1 = new BasicProject();
        vi.spyOn(proj1, 'destroy');
        vi.spyOn(proj1, 'update').mockImplementation(({ frame, time }) => {
            lastFrame = frame;
            lastTime = time;
        });

        // Render first project with per-frame updates and let it roll for 0.25 seconds
        const { component } = render(ProjectViewer, {
            project: proj1
        });
        await waitFor(() => expect(lastTime).toBeGreaterThanOrEqual(0.25));

        let nextTime = 0;
        let nextFrame = 0;
        const proj2 = new BasicProject();
        vi.spyOn(proj2, 'init');
        vi.spyOn(proj2, 'update').mockImplementation(({ frame, time }) => {
            nextFrame = frame;
            nextTime = time;
        });

        // Render second project just until first update, and check params
        component.updateEachFrame = false;
        component.project = proj2;
        expect(proj1.destroy).toHaveBeenCalled();
        expect(proj2.init).toHaveBeenCalled();
        await waitFor(() => expect(proj2.update).toHaveBeenCalled());
        expect(lastFrame).toBeGreaterThan(nextFrame);
        expect(lastTime).toBeGreaterThan(nextTime);
    });
});

describe('ProjectViewer sizing', () => {
    afterEach(cleanup);

    it('sets canvas size appropriately when not configured', async () => {
        const proj = new BasicProject();

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;

        // These aren't what we actually expect in production; need to write E2E tests to validate
        // proper canvas sizing behavior: https://github.com/flatpickles/sketchbook/issues/102
        expect(canvas.style.width).toBe('');
        expect(canvas.width).toBe(0);
        expect(canvas.style.height).toBe('');
        expect(canvas.height).toBe(0);
    });

    it('sets the canvas size appropriately when project is configured', async () => {
        const proj = new BasicProject();

        const { getByTestId } = render(ProjectViewer, {
            project: proj,
            canvasSizeConfig: [1000, 800],
            pixelRatioConfig: 4
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('250px');
        expect(canvas.width).toBe(1000);
        expect(canvas.style.height).toBe('200px');
        expect(canvas.height).toBe(800);
    });

    it('uses default canvas size when not in fullscreen', async () => {
        const proj = new BasicProject();
        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: false,
            defaultCanvasSize: [500, 400]
        });

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('500px');
        expect(canvas.width).toBe(500);
        expect(canvas.style.height).toBe('400px');
        expect(canvas.height).toBe(400);
    });

    it('overrides default canvas size when project is configured', async () => {
        const proj = new BasicProject();
        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: false,
            defaultCanvasSize: [500, 400]
        });

        const { getByTestId } = render(ProjectViewer, {
            project: proj,
            canvasSizeConfig: [1000, 800]
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('1000px');
        expect(canvas.width).toBe(1000);
        expect(canvas.style.height).toBe('800px');
        expect(canvas.height).toBe(800);
    });

    it('updates canvas size reactively when settings change (project not configured)', async () => {
        const proj = new BasicProject();
        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: false,
            defaultCanvasSize: [500, 400]
        });

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('500px');
        expect(canvas.width).toBe(500);
        expect(canvas.style.height).toBe('400px');
        expect(canvas.height).toBe(400);

        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: false,
            defaultCanvasSize: [1000, 800]
        });

        expect(canvas.style.width).toBe('1000px');
        expect(canvas.width).toBe(1000);
        expect(canvas.style.height).toBe('800px');
        expect(canvas.height).toBe(800);

        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: true
        });

        expect(canvas.style.width).toBe('');
        expect(canvas.style.height).toBe('');
        expect(canvas.width).toBe(0);
        expect(canvas.height).toBe(0);
    });

    it('doesnt update canvas size reactively when settings change (project configured)', async () => {
        const proj = new BasicProject();
        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: true
        });

        const { getByTestId } = render(ProjectViewer, {
            project: proj,
            canvasSizeConfig: [1000, 800]
        });

        const canvas = getByTestId('project-canvas') as HTMLCanvasElement;
        expect(canvas.style.width).toBe('1000px');
        expect(canvas.width).toBe(1000);
        expect(canvas.style.height).toBe('800px');
        expect(canvas.height).toBe(800);

        settingsStore.set({
            framerate: 60,
            useFullscreenCanvas: false,
            defaultCanvasSize: [500, 400]
        });

        expect(canvas.style.width).toBe('1000px');
        expect(canvas.width).toBe(1000);
        expect(canvas.style.height).toBe('800px');
        expect(canvas.height).toBe(800);
    });
});

describe('ProjectViewer frameRecorder integration', () => {
    afterEach(cleanup);

    it('starts frame recording and updates project accordingly', async () => {
        const project = new BasicProject();
        const mockFrameRecorder = {
            isRecording: true,
            recordFrame: vi.fn(),
            onStart: vi.fn(),
            onStop: vi.fn(),
            canvas: undefined
        };

        vi.spyOn(project, 'update');
        vi.spyOn(project, 'init');
        vi.spyOn(project, 'destroy');

        render(ProjectViewer, {
            props: {
                project: project
            },
            context: new Map(
                Object.entries({
                    frameRecorder: mockFrameRecorder
                })
            )
        } as any);

        // Wait a bit and make sure it's inited
        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.init).toHaveBeenCalledTimes(1);

        // Simulate frame recording start
        mockFrameRecorder.onStart.mock.calls[0][0]();
        expect(project.init).toHaveBeenCalledTimes(2);
        expect(mockFrameRecorder.recordFrame).toHaveBeenCalled();

        // Simulate frame recording stop
        mockFrameRecorder.onStop.mock.calls[0][0](true);
        expect(project.init).toHaveBeenCalledTimes(3);
    });

    it('updates project and records frame when frameRecorder is recording', async () => {
        const project = new BasicProject();
        const mockFrameRecorder = {
            isRecording: true,
            recordFrame: vi.fn(),
            onStart: vi.fn(),
            onStop: vi.fn(),
            canvas: undefined
        };

        vi.spyOn(project, 'update');

        render(ProjectViewer, {
            props: {
                project: project
            },
            context: new Map(
                Object.entries({
                    frameRecorder: mockFrameRecorder
                })
            )
        } as any);

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.update).toHaveBeenCalled();
        expect(mockFrameRecorder.recordFrame).toHaveBeenCalled();
    });

    it('does not record frame when frameRecorder is not recording', async () => {
        const project = new BasicProject();
        const mockFrameRecorder = {
            isRecording: false,
            recordFrame: vi.fn(),
            onStart: vi.fn(),
            onStop: vi.fn(),
            canvas: undefined
        };

        vi.spyOn(project, 'update');

        render(ProjectViewer, {
            props: {
                project: project
            },
            context: new Map(
                Object.entries({
                    frameRecorder: mockFrameRecorder
                })
            )
        } as any);

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.update).toHaveBeenCalled();
        expect(mockFrameRecorder.recordFrame).not.toHaveBeenCalled();
    });

    it('saves single frame when imgSaveQueued is true', async () => {
        const project = new BasicProject();
        const mockFrameRecorder = {
            isRecording: false,
            recordFrame: vi.fn(),
            saveSingleFrame: vi.fn(),
            onStart: vi.fn(),
            onStop: vi.fn(),
            canvas: undefined
        };

        captureControlStore.set({
            fps: 30,
            startTime: 0,
            imgSaveQueued: true
        });

        vi.spyOn(project, 'update');

        render(ProjectViewer, {
            props: {
                project: project
            },
            context: new Map(
                Object.entries({
                    frameRecorder: mockFrameRecorder
                })
            )
        } as any);

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.update).toHaveBeenCalled();
        expect(mockFrameRecorder.saveSingleFrame).toHaveBeenCalled();
        expect(get(captureControlStore).imgSaveQueued).toBe(false);
    });
});

describe('Project update calls from ProjectViewer', () => {
    afterEach(cleanup);

    it('calls proj update multiple times in render loop', async () => {
        const project = new BasicProject();
        let callCount = 0;
        vi.spyOn(project, 'update').mockImplementation(() => {
            callCount++;
        });

        render(ProjectViewer, {
            project: project
        });
        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(callCount).toBeGreaterThan(1);
    });

    it('calls proj update with canvas & container params (2D)', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: []
        });
    });

    it('calls proj update with canvas & container params (WebGL)', async () => {
        const project = new Project3D();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: []
        });
    });

    it('calls proj update without canvas param (no canvas)', async () => {
        const project = new ProjectNoCanvas();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.update).toHaveBeenCalledWith({
            canvas: undefined,
            container: container,
            context: undefined,
            frame: expect.anything(),
            time: expect.anything(),
            width: undefined,
            height: undefined,
            paramsChanged: []
        });
    });
});

describe('Project resize calls from CanvasViewer', () => {
    afterEach(cleanup);

    it("doesn't call resize on init", async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'resized');

        render(ProjectViewer, {
            project: project
        });
        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.resized).toHaveBeenCalledTimes(0);
    });

    it('calls resized when overlayPanels value changes', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'resized');

        settingsStore.set({
            framerate: 60,
            overlayPanels: false
        });
        render(ProjectViewer, {
            project: project
        });
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(0));

        settingsStore.set({
            framerate: 60,
            overlayPanels: true
        });
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(1));
    });

    it('calls resized when the window gets a resize event', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'resized');

        render(ProjectViewer, {
            project: project
        });

        window.dispatchEvent(new Event('resize'));
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(1));
    });

    it('includes expected params when calling resized', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'resized');

        settingsStore.set({
            framerate: 60,
            overlayPanels: false
        });
        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(0));
        settingsStore.set({
            framerate: 60,
            overlayPanels: true
        });

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.resized).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            canvasSize: [0, 0],
            containerSize: [0, 0]
        });
    });

    it('calls resized multiple times while containerResizing', async () => {
        const project = new BasicProject();
        let callCount = 0;
        vi.spyOn(project, 'resized').mockImplementation(() => {
            callCount++;
        });

        const { component } = render(ProjectViewer, {
            project: project
        });
        component.containerResizing = true;
        await waitFor(() => expect(callCount).toBeGreaterThan(1));

        const currentCallCount = callCount;
        component.containerResizing = false;
        await new Promise((r) => setTimeout(r, 250)); // wait 0.5 seconds
        expect(callCount).toBe(currentCallCount);
    });
});

describe('ProjectViewer staticMode', () => {
    afterEach(cleanup);

    it('calls update with init', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'update');

        const { getByTestId, component } = render(ProjectViewer, {
            project: project,
            staticMode: true
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: []
        });

        const project2 = new BasicProject();
        vi.spyOn(project2, 'update');
        component.project = project2;

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project2.update).toHaveBeenCalledTimes(1);
        expect(project2.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: []
        });
    });

    it('calls update when param changes', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project,
            staticMode: true
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 100)); // wait 0.1 seconds
        expect(project.update).toHaveBeenCalledTimes(1);
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: []
        });

        const testParamConfig = {
            ...NumberParamConfigDefaults,
            key: 'test'
        };
        fireEvent(
            document.body,
            new CustomEvent('params-changed', { detail: [testParamConfig.key], bubbles: true })
        );
        expect(project.update).toHaveBeenCalledTimes(2);
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: [testParamConfig.key]
        });

        // Do another one! Mostly to check that the paramsChanged array is being reset

        const testParamConfig2 = {
            ...NumberParamConfigDefaults,
            key: 'test2'
        };
        fireEvent(
            document.body,
            new CustomEvent('params-changed', { detail: [testParamConfig2.key], bubbles: true })
        );
        expect(project.update).toHaveBeenCalledTimes(3);
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            frame: expect.anything(),
            time: expect.anything(),
            width: expect.anything(),
            height: expect.anything(),
            paramsChanged: [testParamConfig2.key]
        });
    });

    it('calls update when the window gets a resize event', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'update');

        render(ProjectViewer, {
            project: project,
            staticMode: true
        });
        expect(project.update).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event('resize'));
        expect(project.update).toHaveBeenCalledTimes(2);
    });
});

describe('Project paramsChanged calls from CanvasViewer', () => {
    afterEach(cleanup);

    it('includes expected params when calling paramsChanged', async () => {
        const project = new BasicProject();
        vi.spyOn(project, 'paramsChanged');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas = getByTestId('project-canvas');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        const testParamConfig = {
            ...NumberParamConfigDefaults,
            key: 'test'
        };
        fireEvent(
            document.body,
            new CustomEvent('params-changed', { detail: [testParamConfig.key], bubbles: true })
        );

        expect(project.paramsChanged).toHaveBeenCalledWith({
            canvas: canvas,
            container: container,
            context: null, // null during testing, alas
            keys: expect.arrayContaining(['test'])
        });
    });
});

describe('CanvasViewer w/ p5', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("doesn't use the shared canvas, instead instantiates p5", async () => {
        const proj = new P5Project();

        expect(mockedP5).toHaveBeenCalledTimes(0);
        const { queryByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas = queryByTestId('projectCanvas');
        expect(canvas).toBeNull();
        expect(proj.canvas).toBeUndefined();
        expect(mockedP5).toHaveBeenCalledTimes(1);
    });

    it('calls update AND draw (for better or worse)', async () => {
        const proj = new P5Project();
        vi.spyOn(proj, 'update');

        render(ProjectViewer, {
            project: proj
        });
        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        await waitFor(() => expect(proj.update).toHaveBeenCalled());
        expect(mockP5Object.draw).toHaveBeenCalled();
    });

    it('sets up and dismantles p5 instance mode properly', async () => {
        const proj = new P5Project();

        const { component, getByTestId } = render(ProjectViewer, {
            project: proj
        });
        const container = getByTestId('container');
        expect(mockP5Object.remove).toHaveBeenCalledTimes(0);
        expect(mockP5Canvas.parent).toHaveBeenCalledWith(container);

        const newProj = new BasicProject();
        component.project = newProj;
        expect(mockP5Object.remove).toHaveBeenCalledTimes(1);
    });
});
