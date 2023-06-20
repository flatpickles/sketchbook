import Project from '$lib/base/Project';

enum TestEnum {
    First,
    Second,
    Third
}

export default class NoSignal extends Project {
    testString = 'original value';
    testFn = () => {
        console.log('testFn');
    };
    testBool = true;
    testEnum: TestEnum = TestEnum.Second;
    testNumericArray = [4.5, 6.5];
    testFiles: File[] = [];

    #privateField = 'this cannot be seen from the outside';

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        console.log('Loaded: No Signal');
        // console.log(canvas);
        console.log(this.testEnum);
    }

    update() {
        console.log('update');
    }

    logPublicValue() {
        console.log(this.testString);
    }
}
