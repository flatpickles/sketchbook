// Easily mockable file import functions for unit tests

function importProjectClassFiles(): Record<string, () => Promise<unknown>> {
    // Classes may be .ts or .js files
    return import.meta.glob('/src/art/*/*.(ts|js)');
}

function importProjectTextFiles(): Record<string, () => Promise<unknown>> {
    // Text files may be .frag files
    return import.meta.glob('/src/art/*/*.frag', { as: 'raw' });
}

function importProjectConfigFiles(): Record<string, () => Promise<unknown>> {
    return import.meta.glob('/src/art/*/config.json');
}

function importSketchbookConfigFile(): (() => Promise<unknown>) | undefined {
    const files = import.meta.glob('/src/config/config.json');
    if (files && Object.values(files).length > 0) {
        return Object.values(files)[0];
    }
}

export {
    importProjectClassFiles,
    importProjectTextFiles,
    importProjectConfigFiles,
    importSketchbookConfigFile
};
