import Project from '$lib/base/Project/Project';

export default class Test extends Project {
    rectSize = 0.2;
    rectColor = '#34b00c';
    arr = [0.1, 0.5, 0.2];

    slider1 = 0.5;
    slider2 = 0.5;
    slider3 = 0.5;

    noLiveUpdates = 0.3;

    oscillator = 0.0;

    update(detail: { time: number }): void {
        const ctx = this.canvas?.getContext('2d');
        if (!this.canvas || !ctx) throw new Error('Canvas not set');

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = this.rectColor;
        ctx.fillRect(
            (this.canvas.width * (1.0 - this.rectSize)) / 2,
            (this.canvas.height * (1.0 - this.rectSize)) / 2,
            this.canvas.width * this.rectSize,
            this.canvas.height * this.rectSize
        );

        // this.oscillator = Math.sin(detail.time / 500) / 2 + 0.5;
    }

    public paramChanged(detail: { paramKey: string }): void {
        if (detail.paramKey === 'slider1') {
            this.slider2 = this.slider1;
            // console.log(this.slider1);
        }
        if (detail.paramKey === 'slider3') {
            this.arr[2] = this.slider3;
        }
    }
}
