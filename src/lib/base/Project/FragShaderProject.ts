/**
 * A base class for shader art projects. It's unlikely that you will want to subclass this directly;
 * instead, you can create a new project in src/art with just a fragment shader file, i.e. something
 * like src/art/MyShader/MyShader.frag. See the docs for more info.
 */

import * as THREE from 'three';
import Project, {
    CanvasType,
    type DetailWebGL2,
    type ResizedDetailWebGL2,
    type UpdateDetail
} from './Project';

// Uniform names for non-params (i.e. uniforms not specific to a particular project)
const uniformNames: Record<string, string> = {
    time: 'time',
    scaledTime: 'scaledTime',
    renderSize: 'renderSize',
    passBuffer: 'passBuffer'
};

// Prefix used to define the pass number in the fragment shader (PASS_0, PASS_1, etc.)
const PassDefPrefix = 'PASS_';

// Uniform typing stuff
const supportedTypes = ['float', 'int', 'bool', 'vec2', 'vec3', 'vec4'] as const;
type UniformType = (typeof supportedTypes)[number];
type UniformParamType = number | number[] | boolean;

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

// Passthrough vertex shader
const vertexShader = `
    varying vec2 vUv; 
    void main()
    {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
    }`;

type ScaledTimeUpdater = {
    update: (time: number) => void;
    reset: () => void;
};

export default class FragShaderProject extends Project {
    canvasType = CanvasType.WebGL2;

    #renderer: THREE.WebGLRenderer | undefined;
    #scene: THREE.Scene;
    #camera: THREE.OrthographicCamera;
    #quad: THREE.Mesh | null = null;
    #renderTargets: THREE.WebGLRenderTarget[] = [];
    #passMaterials: THREE.ShaderMaterial[] = [];
    #finalPassMaterial: THREE.ShaderMaterial | null = null;

    #fragShader: string;
    #uniforms: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [uniform: string]: THREE.IUniform<any>;
    } = {};
    #nextAnimationFrame: number | null = null;
    #scaledTimeUpdaters: ScaledTimeUpdater[] = [];
    #paramUniformNames: string[] = [];
    #lastRenderedTime = 0;

    constructor(fragShader: string) {
        super();
        this.#fragShader = fragShader;

        // Initialize three stuff
        this.#scene = new THREE.Scene();
        this.#camera = new THREE.OrthographicCamera();
        this.#camera.position.z = 1;

        // Load the fragment shader and parse out the uniforms
        const uniformLines = this.#fragShader.split(';').filter((line) => line.includes('uniform'));
        uniformLines.forEach((line) => {
            // Find uniform name and type for supported uniforms
            const uniformLineComponents = line.split(/\s+/).filter((x) => x.trim().length > 0);
            const uniformTypeIndex = uniformLineComponents.findIndex((x) =>
                isSupportedUniformType(x)
            );
            if (!uniformTypeIndex) return;
            const type = uniformLineComponents[uniformTypeIndex];
            const name = uniformLineComponents[uniformTypeIndex + 1];

            // Provide scaled time uniforms if desired
            const scaledTimeMatcher = new RegExp(`${uniformNames.scaledTime}\\d*`, 'i');
            if (scaledTimeMatcher.test(name)) {
                this.#scaledTimeUpdaters.push(this.#generateScaledTimeUpdater(name));
                return;
            }

            // Ignore other non-user-defined uniforms
            if (Object.keys(uniformNames).includes(name) || name.includes(uniformNames.passBuffer))
                return;

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
                this.#uniforms[name] = { value: value };
                this.#paramUniformNames.push(name);
            }
        });
    }

    init(detail: DetailWebGL2) {
        if (!this.canvas) throw new Error('Canvas not initialized');
        this.#renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            preserveDrawingBuffer: true
        });

        // Reset previous state
        this.#scaledTimeUpdaters.map((updater) => updater.reset());
        this.#passMaterials = [];
        this.#renderTargets = [];
        this.#scene.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                this.#scene.remove(child);
            }
        });

        // Get canvas size & set initial uniforms
        const size = [detail.canvas.width, detail.canvas.height];
        this.#uniforms = {
            ...this.#uniforms,
            [uniformNames.renderSize]: { value: size },
            [uniformNames.time]: { value: 0 }
        };

        // Create pass materials
        const passBufferCount = findLargestSuffixNum(this.#fragShader, uniformNames.passBuffer) + 1;
        for (let i = 0; i < passBufferCount; i++) {
            this.#uniforms[`${uniformNames.passBuffer}${i}`] = { value: null };
            this.#passMaterials.push(
                new THREE.ShaderMaterial({
                    uniforms: this.#uniforms,
                    vertexShader: vertexShader,
                    fragmentShader: `#define ${PassDefPrefix}${i}\n${this.#fragShader}`
                })
            );

            // Add render targets, resized w/ canvas size
            this.#renderTargets.push(new THREE.WebGLRenderTarget(size[0], size[1]));
        }

        // Set up last render
        this.#finalPassMaterial = new THREE.ShaderMaterial({
            uniforms: this.#uniforms,
            vertexShader: vertexShader,
            fragmentShader: this.#fragShader
        });

        // Add fresh quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.#uniforms,
            vertexShader: vertexShader,
            fragmentShader: this.#fragShader
        });
        this.#quad = new THREE.Mesh(geometry, shaderMaterial);
        this.#scene.add(this.#quad);
    }

    resized(detail: ResizedDetailWebGL2): void {
        const size = detail.canvasSize;
        if (!size) return;
        this.#renderer?.setSize(size[0], size[1], false);
        this.#uniforms[uniformNames.renderSize] = { value: size };
        this.#renderTargets.forEach((renderTarget) => {
            renderTarget.setSize(size[0], size[1]);
        });
        this.#render(this.#lastRenderedTime);
    }

    destroy(detail: DetailWebGL2): void {
        super.destroy(detail);
        this.#renderer?.dispose();
        this.#renderer = undefined;
        if (this.#nextAnimationFrame) {
            cancelAnimationFrame(this.#nextAnimationFrame);
            this.#nextAnimationFrame = null;
        }
    }

    update(detail: UpdateDetail<CanvasType>): void {
        this.#render(detail.time);
    }

    /**
     * Renders the scene and updates the uniforms
     * @param time - The current time in seconds
     */
    #render(time: number) {
        if (!this.#quad || !this.#finalPassMaterial || !this.#renderer) {
            return;
        }

        // Update uniforms
        this.#uniforms[uniformNames.time].value = time;
        this.#scaledTimeUpdaters.map((updater) => updater.update(time));
        for (const uniformName of this.#paramUniformNames) {
            const paramValue = Object.getOwnPropertyDescriptor(this, uniformName)?.value;
            this.#uniforms[uniformName].value = paramValue;
        }

        // Render all render targets
        for (let i = 0; i < this.#renderTargets.length; i++) {
            const renderTarget = this.#renderTargets[i];
            const passMaterial = this.#passMaterials[i];
            this.#quad.material = passMaterial;
            this.#renderer.setRenderTarget(renderTarget);
            this.#renderer.render(this.#scene, this.#camera);
            this.#uniforms[`${uniformNames.passBuffer}${i}`].value = renderTarget.texture;
        }

        // Render final pass
        this.#quad.material = this.#finalPassMaterial;
        this.#renderer.setRenderTarget(null);
        this.#renderer.render(this.#scene, this.#camera);
        this.#lastRenderedTime = time;
    }

    /**
     * Scaled time is continuous, but the per-frame time increment changes based on an automatically
     * added timeScale parameter. This is useful for animations with a configurable motion rate that
     * should be continuous as the time scale changes.
     */
    #generateScaledTimeUpdater(uniformName: string): ScaledTimeUpdater {
        // These variables are used to calculate the scaled time, and updated in a JS closure below
        let lastFrameTime = 0;
        let totalScaledTime = 0;

        // Create the parameter property
        const scaledTimeParamKey = 'timeScale' + uniformName.replace(uniformNames.scaledTime, '');
        Object.defineProperty(this, scaledTimeParamKey, {
            value: 1.0,
            writable: true,
            enumerable: true,
            configurable: true
        });

        // Create the uniform
        this.#uniforms[uniformName] = { value: 0 };

        // Return a function that updates the uniform when called
        return {
            update: (time: number) => {
                const scaleParamValue = Object.getOwnPropertyDescriptor(
                    this,
                    scaledTimeParamKey
                )?.value;
                const elapsed = time - lastFrameTime;
                lastFrameTime = time;
                totalScaledTime += elapsed * scaleParamValue;
                this.#uniforms[uniformName].value = totalScaledTime;
            },
            reset: () => {
                lastFrameTime = 0;
                totalScaledTime = 0;
                this.#uniforms[uniformName] = { value: 0 };
            }
        };
    }
}

// Finds the largest numbered suffix in a string (e.g. finds the largest PASS_X number in a string)
function findLargestSuffixNum(sourceStr: string, prefix: string): number {
    const regex = new RegExp(`${prefix}(\\d+)`, 'g');
    let match;
    let largestNumber = -1;

    while ((match = regex.exec(sourceStr)) !== null) {
        const number = parseInt(match[1], 10);
        if (number > largestNumber) {
            largestNumber = number;
        }
    }

    return largestNumber;
}
