precision mediump float;
varying vec2 uv;
uniform float red;
uniform float scaledTime;

void main() {
    vec3 bgColor = vec3(red, uv.y, sin(scaledTime * 10.0) / 2.0 + 0.5);
    gl_FragColor = vec4(bgColor, 1.0);
}