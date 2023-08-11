import Project from '$lib/base/Project';

export default class AllParams extends Project {
    // todo: more params!
    number = 0.1;
    numericArray = [0.5, 0.5];
    boolean = true;
    string = 'hello world';
    function = () => {
        alert('hello!');
    };
    fileInput = async (result: ArrayBuffer[], metadata: File[]) => {
        console.log(result);
        console.log(metadata);
    };
}
