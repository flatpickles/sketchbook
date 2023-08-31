import Project from '$lib/base/Project/Project';

export default class DemoProject extends Project {
    testNumber = 42;
    testBoolean = true;
    testFn = () => {
        alert('Hello world!');
    };
    testColor = '#FF0000';
    testLoad = async (result: string) => {
        // functions with >=1 parameter: Object.getOwnPropertyDescriptor(fn, "length").value
        // parameter can be an array buffer or a string, or an array of same (if multiple files are selected)
        // string is default assumption; can also set "mode" in config to "arraybuffer"
        // after first parameter, could use next params for other file metadata, e.g. name, size, type, date
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/result
        console.log(result);
        const img = new Image();
        img.onload = () => {
            const ctx = this.canvas?.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D context');
            ctx.drawImage(img, 0, 0);
        };
        img.src = result;
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

    arrayColor = [255, 255, 0];

    update() {
        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.fillStyle = this.testColor;
        ctx.fillRect(300, 300, 550, 700);

        ctx.fillStyle = `rgb(${this.arrayColor[0]}, ${this.arrayColor[1]}, ${this.arrayColor[2]})`;
        ctx.fillRect(400, 400, 550, 700);
    }
}
