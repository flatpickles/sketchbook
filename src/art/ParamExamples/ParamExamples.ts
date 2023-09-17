import Project from '$lib/base/Project/Project';

enum StringOptions {
    Option1 = 'option1',
    Option2 = 'option2',
    Option3 = 'option3'
}

export default class AllParams extends Project {
    // Numbers
    numberDefault = 0.1;
    number1to5Int = 4;
    numberSliderOnly = 0.3;
    numberFieldOnly = 0.7;
    numberOption = 3;

    // Strings
    stringDefault = 'hello world';
    stringMultline = 'hello\nworld';
    stringColor = '#011340';
    stringOptions = StringOptions.Option2;

    // Booleans
    booleanDefault = true;

    // Functions
    functionDefault = async () => {
        alert('hello one!');
    };
    functionCustom = async () => {
        alert('hello two!');
    };
    fullWidthFunction = async () => {
        alert('hello three!');
    };

    defaultFile = async (result: string, metadata: File) => {
        console.log(result);
        console.log(metadata);
    };
    multipleAudioFiles = async (result: ArrayBuffer[], metadata: File[]) => {
        console.log(result);
        console.log(metadata);
    };
    singleImageFile = async (result: HTMLImageElement, metadata: File) => {
        console.log(result);
        console.log(metadata);
    };
    multipleVideoFiles = async (result: ArrayBuffer[], metadata: File[]) => {
        console.log(result);
        console.log(metadata);
    };

    // Numeric arrays
    numericArrayDefault = [0.1, 0.9];
    numericArraySliderOnly = [1, 1, 3];
    numericArrayFieldOnly = [0.3, 0.8];
    numericArrayCompactSlider = [0.1, 0.9, 0.8, 0.4];
    numericArrayCompactField = [0.2, 0.7];
    numericArrayOption = [0.3, 0.7];

    update() {
        // draw a box with this.container size
        if (!this.canvas || !this.container) throw new Error('stuff not initialized');
        const ctx = this.canvas.getContext('2d');
        if (!ctx) throw new Error('Context not initialized');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/* todo...
    "options": {
        "A3": [11.7, 16.5],
        "A4": [8.3, 11.7],
        "A5": [5.8, 8.3],
    }
*/
