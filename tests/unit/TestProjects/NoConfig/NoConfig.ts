import Project from '$lib/base/Project';

// No corresponding config file; ok! Still should be listed as available.

export default class NoConfig extends Project {
    testNumber = 42;
    #internalProperty = 42;
}