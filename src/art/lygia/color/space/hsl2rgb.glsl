#include "hue2rgb.glsl"

/*
contributors: Patricio Gonzalez Vivo
description: |
Converts a HSL color to linear RGB
use: <vec3|vec4> hsl2rgb(<vec3|vec4> hsl)
*/

#ifndef FNC_HSL2RGB
#define FNC_HSL2RGB
vec3 hsl2rgb(const in vec3 hsl){
    vec3 rgb=hue2rgb(hsl.x);
    float C=(1.-abs(2.*hsl.z-1.))*hsl.y;
    return(rgb-.5)*C+hsl.z;
}
vec4 hsl2rgb(const in vec4 hsl){return vec4(hsl2rgb(hsl.xyz),hsl.w);}
#endif