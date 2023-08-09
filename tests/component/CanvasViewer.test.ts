import CanvasViewer from '$lib/components/CanvasViewer.svelte';
import Project from '$lib/base/Project';

import { render, cleanup } from '@testing-library/svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';

// https://github.com/hustcc/jest-canvas-mock/issues/2
global.HTMLCanvasElement.prototype.getContext = () => null;

describe('CanvasViewer', () => {
    afterEach(cleanup);

    it('renders a canvas', async () => {
        const { getByTestId } = render(CanvasViewer, {
            project: new Project()
        });

        const canvas = getByTestId('main-canvas');
        expect(canvas).toBeDefined();
    });

    it('inits and updates a project when rendering', async () => {
        const proj = new Project();
        vi.spyOn(proj, 'init');
        vi.spyOn(proj, 'update');

        const { getByTestId } = render(CanvasViewer, {
            project: proj
        });
        expect(proj.init).toHaveBeenCalled();
        expect(proj.update).toHaveBeenCalled();

        const canvas = getByTestId('main-canvas');
        expect(canvas).toBeDefined();
    });

    it('defines a canvas object for the project when rendering', async () => {
        const proj = new Project();
        expect(proj.canvas).toBeUndefined();
        render(CanvasViewer, {
            project: proj
        });
        expect(proj.canvas).toBeDefined();
    });

    it('destroys an old project when rendering a new one', async () => {
        const proj1 = new Project();
        vi.spyOn(proj1, 'destroy');

        const { component } = render(CanvasViewer, {
            project: proj1
        });

        component.project = new Project();
        expect(proj1.destroy).toHaveBeenCalled();
    });
});
