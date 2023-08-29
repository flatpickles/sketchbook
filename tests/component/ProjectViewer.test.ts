import ProjectViewer from '$lib/components/ProjectViewer.svelte';
import Project, { CanvasType } from '$lib/base/Project/Project';

import { render, cleanup } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import P5Project from '$lib/base/Project/P5Project';

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
        expect(proj.update).toHaveBeenCalled();

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
        expect(proj.update).toHaveBeenCalled();

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
});
