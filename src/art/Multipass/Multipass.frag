precision mediump float;

varying vec2 vUv;
uniform float time;
uniform vec2 renderSize;

uniform sampler2D passBuffer0;
uniform sampler2D passBuffer1;

uniform float blendAmount; // 0.9, 0.7 to 0.95

void main() {

#if defined PASS_0 // (output to passBuffer0)
    // scale uv to aspect ratio:
    vec2 xy = vUv * 2.0 - 1.0;
    xy.y = xy.y * renderSize.y / renderSize.x;
    // draw a circle orbiting the center:
    vec2 center = vec2(sin(time) / 2.0, cos(time) / 2.0);
    float dist = distance(xy, center);
    vec4 current = vec4(vec3(step(dist, 0.1)), 1.0);
    // mix with the previous frame:
    vec4 previous = texture(passBuffer1, vUv);
    gl_FragColor = mix(current, previous, blendAmount);

#elif defined PASS_1 // (output to passBuffer1)
    // preserve the first pass for use in the next frame:
    gl_FragColor = texture(passBuffer0, vUv);

#else // (output to screen)
    // render the first pass directly to the screen:
    gl_FragColor = texture(passBuffer0, vUv);

#endif
}