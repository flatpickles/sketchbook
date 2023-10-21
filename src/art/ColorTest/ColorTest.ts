import Project from '$lib/base/Project/Project';

export default class ColorTest extends Project {
    testColor = '#ffffff';
    numberSlider = 34;
    fileInput = (test: string) => console.log(test);
    text = 'hello world';
    numberCombo = 23;
    numberField = 32;
    boopboop = () => console.log('boopboop');
}
