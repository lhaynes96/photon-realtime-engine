#version 300 es
precision highp float;

out vec4 outColor;

in vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform int u_mode;

vec3 palette(float t) {
  return 0.5 + 0.5 * cos(6.28318 * (vec3(0.23, 0.13, 0.57) * t + vec3(0.0, 0.25, 0.5)));
}

void main() {
  vec2 uv = v_uv;
  vec2 center = vec2(0.5) + (u_mouse - 0.5) * 0.25;

  // Simple polar ripple influenced by time and mouse
  vec2 p = uv - center;
  float dist = length(p);
  float angle = atan(p.y, p.x);

  float wave = sin(10.0 * dist - u_time * 2.0 + angle * 0.5);
  float glow = smoothstep(0.35, 0.0, dist) * 0.8 + 0.2;

  float modeBlend = mix(wave, cos(u_time + dist * 12.0), float(u_mode));
  vec3 color = palette(modeBlend + dist * 0.5) * glow;

  // Slight vignette for depth perception
  float vignette = smoothstep(0.9, 0.4, dist + 0.2);
  color *= vignette;

  outColor = vec4(color, 1.0);
}
