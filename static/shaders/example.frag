---
name: example
type: fragment
uniform.centerX: { "type": "1f", "value": "0.0" }
uniform.centerY: { "type": "1f", "value": "0.0" }
uniform.radius: { "type": "1f", "value": "0.0" }
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform float centerX;
uniform float centerY;
uniform float radius;

float rand(float co)
{
    return fract(sin(dot(vec2(co, co) ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
    float gray = 0.5;

    if (pow(gl_FragCoord.x - centerX, 2.0) + pow(gl_FragCoord.y - centerY, 2.0) <= pow(radius, 2.0)){
        gl_FragColor = vec4(0.1, 0.1, 0.1, 0.7);
        float r = radius - 5.0;
        for(int i = 0; i < 8; i++) {
            float random = rand(gray * (sin(3.0*time))) + 0.9;
            if (pow(gl_FragCoord.x - centerX, 2.0) + pow(gl_FragCoord.y - centerY, 2.0) <= pow(r, 2.0)){
                gl_FragColor = vec4(gray / random, 0.5, gray, 0.85);
            }
            r -= 5.0;
            gray -= 0.05;
        }
    }
}