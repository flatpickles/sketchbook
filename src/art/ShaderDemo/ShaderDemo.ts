import REGL from 'regl';
import Project, { CanvasType } from '$lib/base/Project/Project';

export default class ShaderDemo extends Project {
    #regl?: REGL.Regl;

    blue = 0;
    green = 0;

    canvasType = CanvasType.WebGL;

    init() {
        if (!this.canvas) throw new Error('Canvas not initialized');
        this.#regl = REGL(this.canvas);
        const drawShader = this.#regl({
            frag: `
            precision mediump float;
            varying vec2 uv;
            uniform float blue;
            uniform float green;
            void main() {
                gl_FragColor = vec4(uv.y, green, blue, 1);
            }`,

            vert: `
            precision mediump float;
            varying vec2 uv;
            attribute vec2 position;
            void main() {
                uv = vec2(0.5, -0.5) * position + 0.5;
                gl_Position = vec4(position, 0, 1);
            }`,

            attributes: {
                // Two triangles to cover the canvas
                position: [
                    [-1, -1],
                    [-1, 1],
                    [1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1]
                ]
            },

            uniforms: {
                blue: () => this.blue,
                green: () => this.green
            },

            count: 6
        });
        this.#regl.frame(drawShader);
    }

    public destroy() {
        super.destroy();
        this.#regl?.destroy();
    }
}
