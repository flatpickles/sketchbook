import Project from '$lib/base/Project';

export default class DemoProject extends Project {
    testNumber = 42;

    update() {
        console.log(this.testNumber);

        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, 150, 75);
    }
}
