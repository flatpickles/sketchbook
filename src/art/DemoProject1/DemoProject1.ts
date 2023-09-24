import Project from '$lib/base/Project/Project';

import { helperNumber } from '../util/Helper';

export default class DemoProject extends Project {
    testNumber = helperNumber;
    testBoolean = true;
    testFn = () => {
        alert('Hello world!');
    };
    testColor = '#FF0000';

    #img: HTMLImageElement | null = null;
    testLoad = async (result: string) => {
        // functions with >=1 parameter: Object.getOwnPropertyDescriptor(fn, "length").value
        // parameter can be an array buffer or a string, or an array of same (if multiple files are selected)
        // string is default assumption; can also set "mode" in config to "arraybuffer"
        // after first parameter, could use next params for other file metadata, e.g. name, size, type, date
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
        console.log(result);
        this.#img = new Image();
        this.#img.onload = () => {
            const ctx = this.canvas?.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D context');
            ctx.drawImage(this.#img!, 0, 0);
        };
        this.#img.src = result;
        return;
    };
    testLoadImage = async (result: HTMLImageElement) => {
        const ctx = this.canvas?.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.drawImage(result, 0, 0);
    };
    string = "I'm a string!";
    arrayOptions = [4, 5, 6];
    arrayOptions2 = [7, 8, 9];
    stringOptions = 'Second';
    arrayColor = [45, 200, 100];

    #xPos = 300;
    update({ frame }: { frame: number; time: number }) {
        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.fillStyle = `rgb(${this.arrayColor[0]}, ${this.arrayColor[1]}, ${this.arrayColor[2]})`;
        ctx.fillRect(0, 0, 2000, 400);

        ctx.fillStyle = this.testColor;
        this.#xPos = frame % this.canvas.width;
        ctx.fillRect(this.#xPos, 300, 550, 700);

        if (this.#img) {
            ctx.drawImage(this.#img, 0, 0);
        }
    }
}
