precision highp float;

uniform float time;
uniform vec2 renderSize;
varying vec2 vUv;

uniform float red; // -0.2
uniform float scaledTime1;
uniform float scaledTime2;

void main()	{
    float bop = step(0.5, length(vUv - vec2(0.5)));
    gl_FragColor = vec4(red, sin(scaledTime1), cos(scaledTime2), 1.0);
}
