import P5Project from '$lib/base/P5Project';
import type P5 from 'p5';

export default class P5Demo extends P5Project {
    showRect = false;
    rectSize = 0.5;

    draw(p5: P5) {
        p5.background(0);
        p5.fill(60, 100, 0);
        if (this.showRect) p5.rect(400, 400, this.rectSize * 200, this.rectSize * 200);
    }
}
