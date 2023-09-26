// Easily mockable file import functions for unit tests

function importProjectClassFiles(): Record<string, () => Promise<unknown>> {
    // Classes may be .ts or .js files
    return import.meta.glob('/src/art/*/*.(ts|js)');
}

function importProjectTextFiles(): Record<string, () => Promise<unknown>> {
    // Text files can only be .frag files
    return import.meta.glob('/src/art/*/*.frag', { as: 'raw' });
}

function importRawProjectFiles(): Record<string, () => Promise<unknown>> {
    // Raw (text) versions of all potential project files for lightweight validation before loading
    return import.meta.glob('/src/art/*/*.(ts|js|frag)', { as: 'raw' });
}

function importProjectConfigFiles(): Record<string, () => Promise<unknown>> {
    // Import as raw so we can catch any deserialization errors in the loader
    return import.meta.glob('/src/art/*/config.json', { as: 'raw' });
}

export {
    importProjectClassFiles,
    importProjectTextFiles,
    importRawProjectFiles,
    importProjectConfigFiles
};
