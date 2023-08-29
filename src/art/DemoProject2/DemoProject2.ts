import Project from '$lib/base/Project/Project';
import TestImage from './test-image.png';

export default class DemoProject extends Project {
    testBoolean = true;
    size = 0.2;

    #bundledImage: HTMLImageElement;

    constructor() {
        super();
        this.#bundledImage = new Image();
        this.#bundledImage.src = TestImage;
    }

    init() {
        // Can't do from constructor because canvas isn't set yet
        this.#bundledImage.onload = this.update.bind(this);
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
