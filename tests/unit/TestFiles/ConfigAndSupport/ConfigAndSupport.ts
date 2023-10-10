import Project from '$lib/base/Project/Project';

// inline config will be ignored, per explicitConfig in config.json
export default class ConfigAndSupport extends Project {
    testNumber = 42; // -100 to 100, step 1, "Number Name", field
    testString = 'test string'; // "String Name"
    arrayColor = [0.1, 0.2, 0.3];
    #internalProperty = 42;
}
