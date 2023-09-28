import ProjectViewer from '$lib/components/MainView/ProjectViewer.svelte';
import Project, { CanvasType } from '$lib/base/Project/Project';

import { render, cleanup, waitFor, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import P5Project from '$lib/base/Project/P5Project';

import { settingsStore } from '$lib/base/Util/AppState';

// P5 throws errors when running in unit tests, so we mock it out fully.
// This precludes more rigorous DOM testing, but it's better than nothing.
import * as exportsP5 from 'p5';
import { NumberParamConfigDefaults } from '$lib/base/ConfigModels/ParamConfigs/NumberParamConfig';
const mockedP5: Mock = vi.spyOn(exportsP5, 'default');
mockedP5.mockImplementation(() => {
    return { draw: vi.fn() };
});

// Mocking for getContext is required for HTMLCanvasElement to work with Jest/Vitest
// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;

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

describe('CanvasViewer', () => {
    afterEach(cleanup);

    it('renders a canvas', async () => {
        const { getByTestId } = render(ProjectViewer, {
            project: new Project()
        });

        const canvas2D = getByTestId('shared-canvas-2D');
        expect(canvas2D).toBeDefined();
        const canvas3D = getByTestId('shared-canvas-WebGL');
        expect(canvas3D).toBeDefined();
    });

    it('inits and updates a project when rendering (2D context)', async () => {
        const proj = new Project();
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });
        expect(proj.init).toHaveBeenCalled();
        await waitFor(() => expect(proj.update).toHaveBeenCalled());

        const canvas2D = getByTestId('shared-canvas-2D');
        const canvas3D = getByTestId('shared-canvas-WebGL');
        expect(canvas2D.classList.contains('hidden')).toBe(false);
        expect(canvas3D.classList.contains('hidden')).toBe(true);
    });

    it('inits and updates a project when rendering (WebGL context)', async () => {
        const proj = new Project();
        proj.canvasType = CanvasType.WebGL;
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });
        expect(proj.init).toHaveBeenCalled();
        await waitFor(() => expect(proj.update).toHaveBeenCalled());

        const canvas2D = getByTestId('shared-canvas-2D');
        const canvas3D = getByTestId('shared-canvas-WebGL');
        expect(canvas2D.classList.contains('hidden')).toBe(true);
        expect(canvas3D.classList.contains('hidden')).toBe(false);
    });

    it('defines canvas and container objects for the project when rendering', async () => {
        const proj = new Project();
        expect(proj.canvas).toBeUndefined();
        render(ProjectViewer, {
            project: proj
        });
        expect(proj.canvas).toBeDefined();
        expect(proj.container).toBeDefined();
    });

    it('destroys an old project when rendering a new one', async () => {
        const proj1 = new Project();
        vi.spyOn(proj1, 'destroy');

        const { component } = render(ProjectViewer, {
            project: proj1
        });

        component.project = new Project();
        expect(proj1.destroy).toHaveBeenCalled();
    });

    it('resets local state (for update) when loading a new project', async () => {
        let lastTime = 0;
        let lastFrame = 0;

        const proj1 = new Project();
        vi.spyOn(proj1, 'destroy');
        vi.spyOn(proj1, 'update').mockImplementation(({ frame, time }) => {
            lastFrame = frame;
            lastTime = time;
        });

        // Render first project with per-frame updates and let it roll for 0.25 seconds
        const { component } = render(ProjectViewer, {
            project: proj1
        });
        await waitFor(() => expect(lastTime).toBeGreaterThanOrEqual(250));

        let nextTime = 0;
        let nextFrame = 0;
        const proj2 = new Project();
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

    it('sets canvas sizes appropriately when not configured', async () => {
        const proj = new Project();

        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas2D = getByTestId('shared-canvas-2D') as HTMLCanvasElement;
        const canvas3D = getByTestId('shared-canvas-WebGL') as HTMLCanvasElement;

        // These aren't what we actually expect in production; need to write E2E tests to validate
        // proper canvas sizing behavior: https://github.com/flatpickles/sketchbook/issues/102
        expect(canvas2D.style.width).toBe('');
        expect(canvas2D.width).toBe(0);
        expect(canvas2D.style.height).toBe('');
        expect(canvas2D.height).toBe(0);
        expect(canvas3D.style.width).toBe('');
        expect(canvas3D.width).toBe(0);
        expect(canvas3D.style.height).toBe('');
        expect(canvas3D.height).toBe(0);
    });

    it('sets the canvas sizes appropriately when configured', async () => {
        const proj = new Project();

        const { getByTestId } = render(ProjectViewer, {
            project: proj,
            canvasSizeConfig: [1000, 800],
            pixelRatioConfig: 4
        });

        const canvas2D = getByTestId('shared-canvas-2D') as HTMLCanvasElement;
        const canvas3D = getByTestId('shared-canvas-WebGL') as HTMLCanvasElement;
        expect(canvas2D.style.width).toBe('250px');
        expect(canvas2D.width).toBe(1000);
        expect(canvas2D.style.height).toBe('200px');
        expect(canvas2D.height).toBe(800);
        expect(canvas3D.style.width).toBe('250px');
        expect(canvas3D.width).toBe(1000);
        expect(canvas3D.style.height).toBe('200px');
        expect(canvas3D.height).toBe(800);
    });
});

describe('Project update calls from CanvasViewer', () => {
    afterEach(cleanup);

    it('calls proj update multiple times in render loop', async () => {
        const project = new Project();
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
        const project = new Project();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas2D = getByTestId('shared-canvas-2D');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas2D,
            container: container,
            context: undefined, // undefined during testing, alas
            frame: expect.anything(),
            time: expect.anything()
        });
    });

    it('calls proj update with canvas & container params (WebGL)', async () => {
        const project = new Project3D();
        vi.spyOn(project, 'update');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas3D = getByTestId('shared-canvas-WebGL');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.update).toHaveBeenCalledWith({
            canvas: canvas3D,
            container: container,
            context: undefined, // undefined during testing, alas
            frame: expect.anything(),
            time: expect.anything()
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
            time: expect.anything()
        });
    });
});

describe('Project resize calls from CanvasViewer', () => {
    afterEach(cleanup);

    it("doesn't call resize on init", async () => {
        const project = new Project();
        vi.spyOn(project, 'resized');

        render(ProjectViewer, {
            project: project
        });
        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.resized).toHaveBeenCalledTimes(0);
    });

    it('calls resized when overlayPanels value changes', async () => {
        const project = new Project();
        vi.spyOn(project, 'resized');

        settingsStore.set({
            overlayPanels: false
        });
        render(ProjectViewer, {
            project: project
        });
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(0));

        settingsStore.set({
            overlayPanels: true
        });
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(1));
    });

    it('includes expected params when calling resized', async () => {
        const project = new Project();
        vi.spyOn(project, 'resized');

        settingsStore.set({
            overlayPanels: false
        });
        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas2D = getByTestId('shared-canvas-2D');
        const container = getByTestId('container');
        await waitFor(() => expect(project.resized).toHaveBeenCalledTimes(0));
        settingsStore.set({
            overlayPanels: true
        });

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        expect(project.resized).toHaveBeenCalledWith({
            canvas: canvas2D,
            container: container,
            context: undefined, // undefined during testing, alas
            canvasSize: [0, 0],
            containerSize: [0, 0]
        });
    });

    it('calls resized multiple times while containerResizing', async () => {
        const project = new Project();
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

describe('Project paramChanged calls from CanvasViewer', () => {
    afterEach(cleanup);

    it('includes expected params when calling paramChanged', async () => {
        const project = new Project();
        vi.spyOn(project, 'paramChanged');

        const { getByTestId } = render(ProjectViewer, {
            project: project
        });
        const canvas2D = getByTestId('shared-canvas-2D');
        const container = getByTestId('container');

        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        const testParamConfig = {
            ...NumberParamConfigDefaults,
            key: 'test'
        };
        fireEvent(
            document.body,
            new CustomEvent('param-updated', { detail: testParamConfig, bubbles: true })
        );

        expect(project.paramChanged).toHaveBeenCalledWith({
            canvas: canvas2D,
            container: container,
            context: undefined, // undefined during testing, alas
            paramKey: 'test'
        });
    });
});

describe('CanvasViewer w/ P5', () => {
    afterEach(cleanup);

    it("doesn't use the shared canvas, instead instantiates P5", async () => {
        const proj = new P5Project();

        expect(mockedP5).toHaveBeenCalledTimes(0);
        const { getByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvas2D = getByTestId('shared-canvas-2D');
        const canvas3D = getByTestId('shared-canvas-WebGL');
        expect(canvas2D.classList.contains('hidden')).toBe(true);
        expect(canvas3D.classList.contains('hidden')).toBe(true);
        expect(proj.canvas).toBeUndefined();
        expect(mockedP5).toHaveBeenCalledTimes(1);
    });

    it("doesn't call update directly", async () => {
        const proj = new P5Project();
        vi.spyOn(proj, 'update');

        render(ProjectViewer, {
            project: proj
        });
        await new Promise((r) => setTimeout(r, 250)); // wait 0.25 seconds
        await waitFor(() => expect(proj.update).toHaveBeenCalledTimes(0));
    });
});
