import Project from '$lib/base/Project/Project';

export default class EmptyConfig extends Project {
    testNumber = 42;
    testString = 'test string';
    #internalProperty = 42;
}
