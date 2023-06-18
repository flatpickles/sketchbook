const TestEnumType = {
	First: 0,
	Second: 1,
	Third: 2
} as const;

export default class NoSignal {
	#privateField = 'this cannot be seen from the outside';

	testString = 'original value';
	testFn = () => {
		console.log('testFn');
	};
	testBool = true;
	testEnum = TestEnumType.First;
	testNumericArray = [4.5, 6.5];

	constructor() {
		console.log('Loaded: No Signal');
	}

	logPublicValue() {
		console.log(this.testString);
	}
}
