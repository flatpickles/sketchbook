import REGL from 'regl';
import Project, { CanvasType } from '$lib/base/Project/Project';

// todo - color style for numeric array params (vec3)
// todo - improve parsing of shader uniforms
// todo - improve type approach below (duplicated arrays in value and type land)
// todo - integrate into file loading, etc etc

const supportedTypes = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4'];
type UniformType = 'float' | 'int' | 'bool' | 'vec2' | 'vec3' | 'vec4';
function isSupportedType(typeString: string): typeString is UniformType {
    return supportedTypes.includes(typeString);
}

type UniformParamType = number | number[] | boolean;
type REGLUniformMap = Record<string, REGL.DynamicVariableFn<REGL.Uniform>>;
const uniformParamDefaults: Record<UniformType, UniformParamType> = {
    float: 0,
    int: 0,
    bool: false,
    vec2: [0, 0],
    vec3: [0, 0, 0],
    vec4: [0, 0, 0, 0]
};

export default class ShaderDemo extends Project {
    canvasType = CanvasType.WebGL;

    #regl?: REGL.Regl;
    #fragShader?: string;
    #uniformParams: REGLUniformMap = {};

    loadFrag(shader: string) {
        this.#fragShader = shader;
        shader.split('uniform').forEach((uniform) => {
            const components = uniform.split(' ');
            const type = components[1];
            const name = components[2].replace(';', '').replace('\n', '');

            if (isSupportedType(type) && name.length > 0) {
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

    constructor() {
        super();

        this.loadFrag(`
        precision mediump float;
        varying vec2 uv;
        uniform float blue;
        uniform float orange;
        uniform float green;
        void main() {
            gl_FragColor = vec4(uv.y, green, blue, 1);
        }`);
        console.log(this.#uniformParams);
    }

    init() {
        if (!this.canvas) throw new Error('Canvas not initialized');
        this.#regl = REGL(this.canvas);
        const drawShader = this.#regl({
            frag: this.#fragShader,
            vert: `
            precision mediump float;
            varying vec2 uv;
            attribute vec2 position;
            void main() {
                uv = vec2(0.5, -0.5) * position + 0.5;
                gl_Position = vec4(position, 0, 1);
            }`,

            attributes: {
                // Two triangles to cover the canvas
                position: [
                    [-1, -1],
                    [-1, 1],
                    [1, 1],
                    [1, 1],
                    [1, -1],
                    [-1, -1]
                ]
            },

            uniforms: {
                ...this.#uniformParams
            },

            count: 6
        });
        this.#regl.frame(drawShader);
    }

    public destroy() {
        super.destroy();
        this.#regl?.destroy();
    }
}
