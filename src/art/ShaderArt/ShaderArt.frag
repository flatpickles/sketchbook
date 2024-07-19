precision mediump float;

#pragma glslify: noise = require('glsl-noise/simplex/3d')

varying vec2 vUv;

uniform float time;
uniform vec2 renderSize;
uniform float scaledTime;

uniform vec3 bgColor; // [0.1, 0.5, 0.6]
uniform bool softBlob;
uniform float blobRed; // 0.3
uniform float blobGreen; // 0.9

void main() {
    float aspect = renderSize.x / renderSize.y;
    vec2 scaledUV = vec2(aspect, 1.0) * (vUv * 2.0 - 1.0);
    float centerDistance = distance(scaledUV, vec2(0, 0));
    float blobField = noise(vec3(scaledUV * 0.5, scaledTime * 0.1)) * 0.5 + 0.5;
    float blobMask = smoothstep(0.0, softBlob ? 0.1 : 0.001, centerDistance - blobField);
    vec3 blobColor = vec3(blobRed, blobGreen, 1.0 - vUv.y);
    vec3 outColor = mix(blobColor, bgColor, blobMask);
    gl_FragColor = vec4(outColor, 1.0);
}