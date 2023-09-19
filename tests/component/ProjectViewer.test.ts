import ProjectViewer from '$lib/components/MainView/ProjectViewer.svelte';
import Project, { CanvasType } from '$lib/base/Project/Project';

import { render, cleanup, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import P5Project from '$lib/base/Project/P5Project';

import { settingsStore } from '$lib/base/Util/AppState';

// P5 throws errors when running in unit tests, so we mock it out fully.
// This precludes more rigorous DOM testing, but it's better than nothing.
import * as exportsP5 from 'p5';
const mockedP5: Mock = vi.spyOn(exportsP5, 'default');
mockedP5.mockImplementation(() => {
    return { draw: vi.fn() };
});

// Mocking for getContext is required for HTMLCanvasElement to work with Jest
// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;

describe('CanvasViewer', () => {
    afterEach(cleanup);

    it('renders a canvas', async () => {
        const { getAllByTestId } = render(ProjectViewer, {
            project: new Project()
        });

        const canvases = getAllByTestId('shared-canvas');
        expect(canvases.length).toBe(2);
    });

    it('inits and updates a project when rendering (2D context)', async () => {
        const proj = new Project();
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getAllByTestId } = render(ProjectViewer, {
            project: proj
        });
        expect(proj.init).toHaveBeenCalled();
        await waitFor(() => expect(proj.update).toHaveBeenCalled());

        const canvases = getAllByTestId('shared-canvas');
        expect(canvases.length).toBe(2);
        expect(canvases[0].classList.contains('hidden')).toBe(false);
        expect(canvases[1].classList.contains('hidden')).toBe(true);
    });

    it('inits and updates a project when rendering (WebGL context)', async () => {
        const proj = new Project();
        proj.canvasType = CanvasType.WebGL;
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getAllByTestId } = render(ProjectViewer, {
            project: proj
        });
        expect(proj.init).toHaveBeenCalled();
        await waitFor(() => expect(proj.update).toHaveBeenCalled());

        const canvases = getAllByTestId('shared-canvas');
        expect(canvases.length).toBe(2);
        expect(canvases[0].classList.contains('hidden')).toBe(true);
        expect(canvases[1].classList.contains('hidden')).toBe(false);
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

        const { getAllByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvases = getAllByTestId('shared-canvas') as HTMLCanvasElement[];

        // These aren't what we actually expect in production; need to write E2E tests to validate
        // proper canvas sizing behavior: https://github.com/flatpickles/sketchbook/issues/102
        expect(canvases[0].style.width).toBe('');
        expect(canvases[0].width).toBe(0);
        expect(canvases[0].style.height).toBe('');
        expect(canvases[0].height).toBe(0);
        expect(canvases[1].style.width).toBe('');
        expect(canvases[1].width).toBe(0);
        expect(canvases[1].style.height).toBe('');
        expect(canvases[1].height).toBe(0);
    });

    it('sets the canvas sizes appropriately when configured', async () => {
        const proj = new Project();

        const { getAllByTestId } = render(ProjectViewer, {
            project: proj,
            canvasSizeConfig: [1000, 800],
            pixelRatioConfig: 4
        });

        const canvases = getAllByTestId('shared-canvas') as HTMLCanvasElement[];
        expect(canvases[0].style.width).toBe('250px');
        expect(canvases[0].width).toBe(1000);
        expect(canvases[0].style.height).toBe('200px');
        expect(canvases[0].height).toBe(800);
        expect(canvases[1].style.width).toBe('250px');
        expect(canvases[1].width).toBe(1000);
        expect(canvases[1].style.height).toBe('200px');
        expect(canvases[1].height).toBe(800);
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

    it('calls paramChanged with expected parameters', async () => {
        const project = new Project();
        vi.spyOn(project, 'paramChanged');

        // First update call should have no paramKeys, and frame 0
        const { component } = render(ProjectViewer, {
            project: project
        });
        expect(project.paramChanged).toHaveBeenCalledTimes(0);

        // After paramUpdated, paramKeys should reflect the updated param, and frame count should
        // increment to 1
        component.paramUpdated({
            detail: {
                updatedProject: project,
                paramKey: 'testKey'
            }
        } as CustomEvent);
        await waitFor(() => expect(project.paramChanged).toHaveBeenCalledTimes(1));
        expect(project.paramChanged).toHaveBeenLastCalledWith(
            expect.objectContaining({
                paramKey: 'testKey'
            })
        );
    });
});

describe('CanvasViewer w/ P5', () => {
    afterEach(cleanup);

    it("doesn't use the shared canvas, instead instantiates P5", async () => {
        const proj = new P5Project();

        expect(mockedP5).toHaveBeenCalledTimes(0);
        const { getAllByTestId } = render(ProjectViewer, {
            project: proj
        });

        const canvases = getAllByTestId('shared-canvas');
        expect(canvases[0].classList.contains('hidden')).toBe(true);
        expect(canvases[1].classList.contains('hidden')).toBe(true);
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
