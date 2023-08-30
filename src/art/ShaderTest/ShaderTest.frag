precision mediump float;

varying vec2 uv;
uniform float blue;
uniform float orange;
uniform float green;
void main() {
    gl_FragColor = vec4(uv.y, green, blue, 1);
}