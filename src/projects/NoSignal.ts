export default class NoSignal {
	publicValue = 'original value';
	#privateField = 'this cannot be seen from the outside';

	constructor() {
		console.log('Loaded: No Signal');
	}

	logPublicValue() {
		console.log(this.publicValue);
	}
}
