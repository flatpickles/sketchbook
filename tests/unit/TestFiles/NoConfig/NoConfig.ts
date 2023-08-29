import Project from '$lib/base/Project/Project';

// No corresponding config file; ok! Still should be listed as available.

export default class NoConfig extends Project {
    testNumber = 42;
    #internalProperty = 42;
    testFunction = () => {
        return this.#internalProperty;
    };
    testNumericArray = [1, 2, 3];
}
