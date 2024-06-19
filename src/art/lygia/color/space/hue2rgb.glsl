#include "../../math/saturate.glsl"

/*
contributors: Patricio Gonzalez Vivo
description: |
Converts a hue value to a RGB vec3 color.
use: <vec3> hue2rgb(<float> hue)
*/

#ifndef FNC_HUE2RGB
#define FNC_HUE2RGB
vec3 hue2rgb(const in float hue){
    float R=abs(hue*6.-3.)-1.;
    float G=2.-abs(hue*6.-2.);
    float B=2.-abs(hue*6.-4.);
    return saturate(vec3(R,G,B));
}
#endif