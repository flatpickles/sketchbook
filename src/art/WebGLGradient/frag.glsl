precision mediump float;

varying vec2 uv;

uniform float blue;
uniform float green;
uniform bool horizontal;
uniform bool inverted;

void main() {
    float rVal = horizontal ? uv.x : uv.y;
    if (inverted) rVal = 1.0 - rVal;
    gl_FragColor = vec4(rVal, green, blue, 1.0);
}