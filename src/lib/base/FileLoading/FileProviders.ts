// Easily mockable file import functions for unit tests

function importProjectClassFiles(): Record<string, () => Promise<unknown>> {
    return import.meta.glob('/src/art/*/*.ts');
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

export { importProjectClassFiles, importProjectConfigFiles, importSketchbookConfigFile };
