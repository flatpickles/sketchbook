import Project from '$lib/base/Project';

import canvasSketch from 'canvas-sketch';

export default class CanvasSketchDemo extends Project {
    size = 0.8;
    colored = true;

    #fgColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    randomize = () => {
        this.#fgColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
        })`;
    };

    #sketchManager: any;
    #sketchFn = () => {
        let position = 0;
        return (props: any) => {
            const squareSize = this.size * 512;
            const { context, width, height } = props;

            // Fill the canvas with pink
            context.fillStyle = 'pink';
            context.fillRect(0, 0, width, height);

            // Draw a white rectangle in the center
            context.fillStyle = this.colored ? this.#fgColor : 'white';
            context.fillRect(position % width, (height - squareSize) / 2, squareSize, squareSize);

            // Split rectangle in two when wrapping around
            if (position > width - squareSize) {
                context.fillRect(
                    0,
                    (height - squareSize) / 2,
                    squareSize - (width - position),
                    squareSize
                );
            }

            // Increment
            position = (position + 3) % width;

            // Write some text in the top left
            context.fillStyle = 'white';
            context.font = 'bold 24px Helvetica';
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText('Hello Canvas Sketch', 400, 100);
        };
    };

    async init() {
        this.#sketchManager = await canvasSketch(this.#sketchFn, {
            canvas: this.canvas,
            resizeCanvas: false,
            animate: true
        });
    }

    update() {
        this.#sketchManager?.render();
    }

    destroy() {
        super.destroy();
        this.#sketchManager?.unload();

        // Even after unload, sketchManager will clear the canvas on resize
        // todo: canvas-sketch PR to fix this. For now, just clear the canvas
        this.#sketchManager.props.canvas = null;
    }
}
