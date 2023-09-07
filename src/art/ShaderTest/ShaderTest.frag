precision mediump float;

varying vec2 uv;

uniform float time;
uniform vec2 renderSize;

uniform float blue;
uniform float green;
uniform bool showCircle;
uniform vec3 bgColor;

void main() {
    float aspect = renderSize.x / renderSize.y;
    vec2 scaledUV = vec2(aspect, 1.0) * (uv * 2.0 - 1.0);

    if (showCircle) {
        if (distance(scaledUV, vec2(0, 0)) > fract(time / 10.0)) {
            gl_FragColor = vec4(bgColor, 1);
            return;
        }
    }
    gl_FragColor = vec4(uv.y, green, blue, 1);
}