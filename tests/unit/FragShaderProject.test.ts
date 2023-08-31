import { describe, it, expect } from 'vitest';
import FragShaderProject from '$lib/base/Project/FragShaderProject';

// Don't show errors when accessing param properties that haven't been explicitly defined
class FragShaderWithParams extends FragShaderProject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

describe('FragShaderProject', () => {
    it("properly loads in a shader's uniforms as params", () => {
        const project = new FragShaderProject(`
            precision mediump float;
            varying vec2 uv;
            uniform float testFloat;
            uniform int testInt;
            uniform bool testBool;
            uniform vec2 testVec2;
            uniform vec3 testVec3;
            uniform vec4 testVec4;
            void main() {
                gl_FragColor = vec4(0, 0, 0, 1);
            }`) as FragShaderWithParams;
        expect(project).toBeDefined();
        expect(project.testFloat).toBe(0);
        expect(project.testInt).toBe(0);
        expect(project.testBool).toBe(false);
        expect(project.testVec2).toEqual([0, 0]);
        expect(project.testVec3).toEqual([0, 0, 0]);
        expect(project.testVec4).toEqual([0, 0, 0, 0]);
    });
});
