precision highp float;

#include ../lygia/generative/cnoise;
#include ../lygia/color/space/hsl2rgb;

varying vec2 vUv;
uniform float time;
uniform vec2 renderSize;

uniform sampler2D passBuffer0;
uniform sampler2D passBuffer1;

float timeScale = 0.02;
float spaceScale = 40.0;
float sourceLookupRatio = 0.8;
float warpScale = 0.03;
float blendAmount = 0.92;

void main()	{
#ifdef PASS_0
    // Scale dimensions
    float scaledTime = time * timeScale;
    vec2 xy = vUv * 2.0 - 1.0;
    xy.y = xy.y * renderSize.y / renderSize.x;

    float sourceScale = spaceScale * sourceLookupRatio;
    float lookupScale = spaceScale;

    float noiseVal = cnoise(vec3(vUv.x * sourceScale, vUv.y * sourceScale, scaledTime * 2.0)) + 0.3;
    vec4 color = vec4(hsl2rgb(vec3(noiseVal, 1.0, 0.4)), 1.0);

    vec4 previous = texture(passBuffer1, vUv);
    float warpX = cnoise(vec3(vUv.x * lookupScale, vUv.y * lookupScale, scaledTime));
    float warpY = cnoise(vec3(vUv.y * lookupScale, vUv.x * lookupScale, scaledTime + 100.0));
    vec2 warpOffset = vec2(warpX, warpY) * warpScale;
    vec4 warped = texture(passBuffer1, vUv + warpOffset);
    gl_FragColor = mix(color, warped, blendAmount);
#elif defined PASS_1
    gl_FragColor = texture(passBuffer0, vUv);
#else
    gl_FragColor = texture(passBuffer0, vUv);
#endif
}
