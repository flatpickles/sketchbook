precision mediump float;

varying vec2 uv;
attribute vec2 position;

void main() {
    uv = vec2(0.5, -0.5) * position + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}