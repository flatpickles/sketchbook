import Project from '$lib/base/Project/Project';

// inline config will be ignored, per inlineConfig in config.json
export default class ConfigAndSupport extends Project {
    testNumber1 = 42; // -100 to 100, step 1, "Number Name", field, 21
    testNumber2 = 42; // -100 to 100, step 1, "Number Name", field, 21
    testNumber3 = 42;
    testBoolean = true; // "Boolean Name"
}
