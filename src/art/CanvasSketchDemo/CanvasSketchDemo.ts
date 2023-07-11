import Project from '$lib/base/Project';

import canvasSketch from 'canvas-sketch';

export default class CanvasSketchDemo extends Project {
    size = 256;
    #sketchManager: any;
    #sketchFn = () => {
        return (props: any) => {
            const { context, width, height } = props;

            // Fill the canvas with pink
            context.fillStyle = 'pink';
            context.fillRect(0, 0, width, height);

            // Write some text in the top left
            context.fillStyle = 'white';
            context.font = 'bold 24px Helvetica';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText('Hello Canvas Sketch', 0, 0);
        };
    };

    async init() {
        this.#sketchManager = await canvasSketch(this.#sketchFn, {
            canvas: this.canvas,
            resizeCanvas: false
        });
    }

    update() {
        this.#sketchManager?.render();
    }
}
