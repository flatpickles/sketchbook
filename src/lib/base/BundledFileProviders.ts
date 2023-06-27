// Easily mockable file import functions for unit tests

function importProjectClassFiles(): Record<string, () => Promise<unknown>> {
    return import.meta.glob('/src/art/*/*.ts');
}

function importProjectConfigFiles(): Record<string, () => Promise<unknown>> {
    return import.meta.glob('/src/art/*/config.json');
}

export { importProjectClassFiles, importProjectConfigFiles };
