import REGL from 'regl';
import Project, { CanvasType, type Detail, type DetailWebGL } from '$lib/base/Project/Project';

import fragShader from './frag.glsl?raw';
import vertShader from './vert.glsl?raw';

enum GradientDirection {
    LeftRight = 0,
    TopBottom = 1,
    RightLeft = 2,
    BottomTop = 3
}

export default class ShaderDemo extends Project {
    canvasType = CanvasType.WebGL;

    blue = 0.75;
    green = 0.25;
    direction: GradientDirection = GradientDirection.LeftRight;
    #regl?: REGL.Regl;

    init({ canvas }: DetailWebGL) {
        this.#regl = REGL(canvas);
        const drawGradient = this.#regl({
            frag: fragShader,
            vert: vertShader,
            attributes: {
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
                green: () => this.green,
                horizontal: () =>
                    this.direction === GradientDirection.LeftRight ||
                    this.direction === GradientDirection.RightLeft,
                inverted: () =>
                    this.direction === GradientDirection.RightLeft ||
                    this.direction === GradientDirection.BottomTop
            },
            count: 6
        });
        this.#regl.frame(drawGradient);
    }

    public destroy(detail: Detail) {
        super.destroy(detail);
        this.#regl?.destroy();
    }
}
