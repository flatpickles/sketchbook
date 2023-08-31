precision mediump float;

varying vec2 uv;
uniform float blue;
uniform float green;
uniform bool showBox;
uniform vec3 boxColor;
void main() {
    if (showBox) {
        if (uv.x < 0.1 || uv.x > 0.9 || uv.y < 0.1 || uv.y > 0.9) {
            gl_FragColor = vec4(boxColor, 1);
            return;
        }
    }
    gl_FragColor = vec4(uv.y, green, blue, 1);
}