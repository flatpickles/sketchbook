import P5Project from '$lib/base/Project/P5Project';
import type { ParamsChangedDetail, ResizedDetail } from '$lib/base/Project/Project';
import type P5 from 'p5';

type ColorArray = [number, number, number];

export default class P5Demo extends P5Project {
    circleBaseSize = 50;
    circleSizeVariation = 50;
    bgColor: ColorArray = [123, 43, 21];
    resetCanvas = () => {
        this.p5?.background(...this.bgColor);
    };

    // p5.js methods:

    setup() {
        this.resetCanvas();
    }

    mouseMoved(p5: P5) {
        const circleColor: ColorArray = [
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        ];
        const circleSize = this.circleBaseSize + Math.random() * this.circleSizeVariation;
        p5.fill(...circleColor);
        p5.circle(p5.mouseX, p5.mouseY, circleSize);
    }

    // Sketchbook methods:

    resized(detail: ResizedDetail) {
        super.resized(detail);
        this.resetCanvas();
    }

    paramsChanged(detail: ParamsChangedDetail) {
        super.paramsChanged(detail);
        if (detail.keys.includes('bgColor')) this.resetCanvas();
    }
}
