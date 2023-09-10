/**
 * A base class for shader art projects. It's unlikely that you will want to subclass this directly;
 * instead, you can create a new project in src/art with just a fragment shader file, i.e. something
 * like src/art/MyShader/MyShader.frag. See the docs for more info.
 */

import REGL from 'regl';
import Project, { CanvasType } from './Project';

// Uniform names for non-params (i.e. uniforms not specific to a particular project)
const timeUniformName = 'time';
const renderSizeUniformName = 'renderSize';

// Uniform typing stuff
const supportedTypes = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4'] as const;
type UniformType = (typeof supportedTypes)[number];
type UniformParamType = number | number[] | boolean;
type REGLUniformMap = Record<string, REGL.DynamicVariableFn<REGL.Uniform>>;

// Default values for supported uniform types
const uniformParamDefaults: Record<UniformType, UniformParamType> = {
    float: 0,
    int: 0,
    bool: false,
    vec2: [0, 0],
    vec3: [0, 0, 0],
    vec4: [0, 0, 0, 0]
};

// Type guard for supported uniform type strings
function isSupportedUniformType(uniformTypeString: string): uniformTypeString is UniformType {
    return supportedTypes.includes(uniformTypeString as UniformType);
}

// Vertex shader defaults (two triangles to cover the canvas)
const vertShader = `
    precision mediump float;
    varying vec2 uv;
    attribute vec2 position;
    void main() {
        uv = vec2(0.5, -0.5) * position + 0.5;
        gl_Position = vec4(position, 0, 1);
    }`;
const positions = [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, 1],
    [1, -1],
    [-1, -1]
];

export default class FragShaderProject extends Project {
    canvasType = CanvasType.WebGL;

    #fragShader: string;
    #uniformParams: REGLUniformMap = {};
    #regl?: REGL.Regl;

    constructor(fragShader: string) {
        super();

        // Load the fragment shader
        this.#fragShader = fragShader;
        const uniformLines = fragShader.split(';').filter((line) => line.includes('uniform'));
        uniformLines.forEach((line) => {
            // Find uniform name and type for supported uniforms
            const uniformLineComponents = line.split(/\s+/).filter((x) => x.trim().length > 0);
            const uniformTypeIndex = uniformLineComponents.findIndex((x) =>
                isSupportedUniformType(x)
            );
            if (!uniformTypeIndex) return;
            const type = uniformLineComponents[uniformTypeIndex];
            const name = uniformLineComponents[uniformTypeIndex + 1];

            // Ignore non-user-defined uniforms
            if ([timeUniformName, renderSizeUniformName].includes(name)) return;

            // Use name and type to parameterize this uniform
            if (isSupportedUniformType(type) && name.length > 0) {
                // Create a default property value if the uniform type is supported
                const value = uniformParamDefaults[type];
                Object.defineProperty(this, name, {
                    value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
                // Add to the uniform params map
                this.#uniformParams[name] = () => {
                    return Object.getOwnPropertyDescriptor(this, name)?.value;
                };
            }
        });
    }

    init() {
        if (!this.canvas) throw new Error('Canvas not initialized');

        // Initialize regl with the shader & uniforms (loaded in the constructor)
        this.#regl = REGL(this.canvas);
        const drawFrame = this.#regl({
            frag: this.#fragShader,
            vert: vertShader,
            attributes: {
                position: positions
            },
            uniforms: {
                ...this.#uniformParams,
                [timeUniformName]: ({ time }) => time,
                [renderSizeUniformName]: ({ viewportWidth, viewportHeight }) => [
                    viewportWidth,
                    viewportHeight
                ]
            },
            count: positions.length
        });

        // Immediate draw + animation loop
        drawFrame();
        this.#regl.frame(drawFrame);
    }

    destroy(): void {
        super.destroy();
        this.#regl?.destroy();
    }
}
