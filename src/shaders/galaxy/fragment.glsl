var fragment_shader = `
uniform float time;
uniform vec3 color;
varying vec2 vUv;
void main() {
    gl_FragColor.rgba = vec4(0.15, 0.29, 0.29, 1.0);
}`;
