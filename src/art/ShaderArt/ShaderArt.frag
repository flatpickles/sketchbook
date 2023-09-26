precision mediump float;

#pragma glslify: noise = require('glsl-noise/simplex/3d')

varying vec2 uv;

uniform float time;
uniform vec2 renderSize;

uniform vec3 bgColor;
uniform bool softBlob;
uniform float blobRed;
uniform float blobGreen;

void main() {
    float aspect = renderSize.x / renderSize.y;
    vec2 scaledUV = vec2(aspect, 1.0) * (uv * 2.0 - 1.0);
    float centerDistance = distance(scaledUV, vec2(0, 0));
    float blobField = noise(vec3(scaledUV * 0.5, time * 0.1)) * 0.5 + 0.5;
    float blobMask = smoothstep(0.0, softBlob ? 0.1 : 0.001, centerDistance - blobField);
    vec3 blobColor = vec3(blobRed, blobGreen, 1.0 - uv.y);
    vec3 outColor = mix(blobColor, bgColor, blobMask);
    gl_FragColor = vec4(outColor, 1.0);
}