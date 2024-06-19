/*
contributors: [Stefan Gustavson, Ian McEwan]
description: grad4, used for snoise(vec4 v)
use: grad4(<float> j, <vec4> ip)
*/

#ifndef FNC_GRAD4
#define FNC_GRAD4
vec4 grad4(float j,vec4 ip){
    const vec4 ones=vec4(1.,1.,1.,-1.);
    vec4 p,s;
    
    p.xyz=floor(fract(vec3(j)*ip.xyz)*7.)*ip.z-1.;
    p.w=1.5-dot(abs(p.xyz),ones.xyz);
    s=vec4(lessThan(p,vec4(0.)));
    p.xyz=p.xyz+(s.xyz*2.-1.)*s.www;
    
    return p;
}
#endif
