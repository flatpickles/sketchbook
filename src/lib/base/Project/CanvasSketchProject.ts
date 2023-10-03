/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

import Project, { type Detail2D, type ParamChangedDetail2D } from '$lib/base/Project/Project';
import canvasSketch from 'canvas-sketch';

type CanvasSketchManager = any;
type CanvasSketchProps = any;
type CanvasSketchRender = any;

export default class CanvasSketchProject extends Project {
    dimensions = [8.5, 11];

    async sketch(initialProps: CanvasSketchProps): Promise<CanvasSketchRender> {}

    #sketchManager: CanvasSketchManager;
    async init() {
        this.#sketchManager = await canvasSketch(this.sketch, {
            dimensions: this.dimensions,
            pixelsPerInch: 300,
            units: 'in',
            canvas: this.canvas,
            resizeCanvas: true,
            animate: true,
            hotkeys: false // todo; can we still enable save hotkey without enabling play toggling with space
        });
    }

    resized() {
        this.#sketchManager?.update();
    }

    paramChanged(detail: ParamChangedDetail2D) {
        super.paramChanged(detail);
        if (detail.key === 'dimensions') {
            this.#sketchManager?.update({
                dimensions: this.dimensions
            });
        }
    }

    destroy(detail: Detail2D) {
        super.destroy(detail);
        this.#sketchManager?.unload();

        // Even after unload, sketchManager will clear the canvas on resize
        // todo: canvas-sketch PR to fix this. For now, just clear the canvas
        this.#sketchManager.props.canvas = null;
    }
}
