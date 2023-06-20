const TestEnumType = {
    First: 0,
    Second: 1,
    Third: 2
} as const;

enum TestEnum {
    First,
    Second,
    Third
}

export default class NoSignal {
    testString = 'original value';
    testFn = () => {
        console.log('testFn');
    };
    testBool = true;
    testEnum: TestEnum = TestEnum.Second;
    testNumericArray = [4.5, 6.5];
    testFiles: File[] = [];

    #privateField = 'this cannot be seen from the outside';

    constructor() {
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
