import REGL from 'regl';
import Project, { CanvasType } from './Project';

// todo: keep working on this

export default class REGLProject extends Project {
    public regl?: REGL.Regl;

    canvasType = CanvasType.WebGL;

    init() {
        if (!this.canvas) throw new Error('Canvas not initialized');
        this.regl = REGL(this.canvas);
        const drawTriangle = this.regl({
            frag: `
            void main() {
              gl_FragColor = vec4(0, 1, 0.5, 1);
            }`,

            vert: `
            attribute vec2 position;
            void main() {
              gl_Position = vec4(position, 0, 1);
            }`,

            attributes: {
                position: [
                    [0, -1],
                    [-1, 0],
                    [1, 1]
                ]
            },

            count: 3
        });
        drawTriangle();
    }

    public destroy() {
        super.destroy();
        this.regl?.destroy();
    }
}
