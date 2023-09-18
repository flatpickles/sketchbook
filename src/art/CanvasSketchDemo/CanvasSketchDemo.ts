import Project from '$lib/base/Project/Project';

import canvasSketch from 'canvas-sketch';

enum StringEnumTest {
    Yes = 'yes',
    No = 'no',
    Maybe = 'maybe'
}

export default class CanvasSketchDemo extends Project {
    displayText = 'Hello Canvas Sketch';
    colored = true;
    bgSize = [0.7, 0.9];
    size = 0.8;
    bgColor = '#ff8811';
    multiText = 'yes yes\nno no';
    enumTest = StringEnumTest.Yes;

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
            context.clearRect(0, 0, width, height);
            context.fillStyle = this.bgColor;
            context.fillRect(0, 0, width * this.bgSize[0], height * this.bgSize[1]);

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
            context.fillText(this.displayText + ' - ' + this.enumTest, 400, 100);
        };
    };

    async init() {
        this.#sketchManager = await canvasSketch(this.#sketchFn, {
            dimensions: [1000, 1500],
            canvas: this.canvas,
            resizeCanvas: true,
            animate: true,
            hotkeys: false // todo; can we still enable save hotkey without enabling play toggling with space
        });
    }

    update() {
        if (this.#sketchManager && this.#sketchManager.settings.animate) return;
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
