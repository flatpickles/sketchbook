import Project from '$lib/base/Project';

enum StringOptions {
    Option1 = 'Option 1',
    Option2 = 'Option 2',
    Option3 = 'Option 3'
}

export default class AllParams extends Project {
    // Numbers
    numberDefault = 0.1;
    number1to5Int = 4;
    numberSliderOnly = 0.3;
    numberFieldOnly = 0.7;

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

    defaultFile = async (result: string, metadata: File) => {
        console.log(result);
        console.log(metadata);
    };
    multipleAudioFiles = async (result: ArrayBuffer[], metadata: File[]) => {
        console.log(result);
        console.log(metadata);
    };
    singleImageFile = async (result: string, metadata: File) => {
        console.log(result);
        console.log(metadata);
    };
    multipleVideoFiles = async (result: ArrayBuffer[], metadata: File[]) => {
        console.log(result);
        console.log(metadata);
    };

    // Numeric arrays
    numericArrayDefault = [0.1, 0.9];
    numericArraySliderOnly = [4, 1, 3];
    numericArrayFieldOnly = [0.3, 0.8];
    numericArrayCompactSlider = [0.1, 0.9, 0.8, 0.4];
    numericArrayCompactField = [0.2, 0.7];
}
