import Project from '$lib/base/Project/Project';

enum StringOptions {
    Option1 = 'option1',
    Option2 = 'option2',
    Option3 = 'option3'
}

/**
 * This project demonstrates all the different types of parameters that can be used in a project.
 *
 * Note: all parameter configuration is done in config.json for demonstrative purposes, but in
 * practice, it may be more convenient to configure parameters via commented annotations inline
 * with your instance variable definitions. See https://skbk.cc/#/param-config for more details.
 */
export default class AllParams extends Project {
    // Numbers
    numberDefault = 0.1;
    number1to5Int = 4;
    numberSliderOnly = 0.3;
    numberFieldOnly = 0.7;
    numberOption = 3;

    // Booleans
    booleanDefault = true;

    // Strings
    stringDefault = 'hello world';
    stringMultline = 'hello\nworld';
    stringColor = '#011340';
    stringOptions = StringOptions.Option3;

    // Numeric arrays
    arrayDefault = [0.1, 0.9];
    arraySliderOnly = [1, 4, 3];
    arrayFieldOnly = [0.3, 0.8];
    arrayCompactSlider = [0.1, 0.9, 0.8, 0.4];
    arrayCompactField = [0.2, 0.7];
    arrayColor = [0.1, 0.9, 0.8];
    arrayOption = [0.5, 0.5];
    dimensionsOption = [8.3, 11.7];

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

    // Files
    fileDefault = async (result: string, metadata: File) => {
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
}
