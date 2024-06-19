/*
contributors: Patricio Gonzalez Vivo
description: clamp a value between 0 and 1
use: saturation(<float|vec2|vec3|vec4> value)
examples:
- https://raw.githubusercontent.com/patriciogonzalezvivo/lygia_examples/main/math_functions.frag
*/

#if!defined(FNC_SATURATE)&&!defined(saturate)
#define FNC_SATURATE
#define saturate(V)clamp(V,0.,1.)
#endif