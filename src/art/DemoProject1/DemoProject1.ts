import Project from '$lib/base/Project';

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
        return;
    };

    update() {
        if (!this.canvas) throw new Error('Canvas not set');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');
        ctx.fillStyle = '#9900FF';
        ctx.fillRect(100, 100, 550, 700);
    }
}
