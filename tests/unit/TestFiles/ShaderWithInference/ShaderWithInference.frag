precision mediump float;

varying vec2 uv;
uniform float testNumber1; // 42, -100 to 100, step 1, "Number Name", field
uniform float testNumber2; // 84, -100 to 100, step 1, "Number Name", field
uniform float testNumber3;
uniform bool testBoolean; // true
uniform vec3 array1; // [0.1, 0.5, 0.9], step 0.1, "Array"
uniform vec2 array2; // [15, 25]
void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
}