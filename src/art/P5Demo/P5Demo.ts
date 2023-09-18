import P5Project from '$lib/base/Project/P5Project';
import type P5 from 'p5';

export default class P5Demo extends P5Project {
    showRect = true;
    rectSize = 0.5;

    #pos = 200;

    draw(p5: P5) {
        p5.background(100);
        p5.fill(60, 100, 0);
        if (this.showRect) p5.rect(this.#pos, 200, this.rectSize * 200, this.rectSize * 200);
        this.#pos = (this.#pos + 1) % p5.width;
    }
}
