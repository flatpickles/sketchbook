import Project from '$lib/base/Project';
import TestImage from './test-image.png';
import { browser } from '$app/environment';

export default class DemoProject extends Project {
    testBoolean = true;
    size = 0.2;

    #bundledImage: HTMLImageElement | undefined;

    constructor() {
        super();

        // todo: Don't instantiate in SSR
        if (!browser) return;
        this.#bundledImage = new Image();
        this.#bundledImage.onload = this.update.bind(this);
        this.#bundledImage.src = TestImage;
    }

    update() {
        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#00FF00';
        if (this.#bundledImage && this.testBoolean)
            ctx.drawImage(this.#bundledImage, 0, 0, this.canvas.width, this.canvas.height);
        ctx.fillRect(200, 200, this.size * this.canvas.width, this.size * this.canvas.height);
    }
}
