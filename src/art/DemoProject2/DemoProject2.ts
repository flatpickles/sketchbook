import Project from '$lib/base/Project';

export default class DemoProject extends Project {
    // testNumber = 42;
    testBoolean = true;
    size = 0.5;

    update() {
        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, 0, this.size * this.canvas.width, this.size * this.canvas.height);
    }
}
