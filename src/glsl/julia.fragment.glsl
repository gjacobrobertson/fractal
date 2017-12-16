precision highp float;

struct EscapeTime {
  int n;
  vec2 z;
  bool escaped;
};

const float logBase = 1.0 / log(2.0);
const float logHalfBase = log(0.5) * logBase;
const int maxIterations = 1000;

uniform vec2 uKernel;
uniform float uHue;
uniform int uIterations;

varying vec2 vComplex;

EscapeTime escape(vec2 c) {
  vec2 z = c;
  for (int i = 0; i < maxIterations; i++) {
    if (i >= uIterations) {
      return EscapeTime(uIterations, z, false);
    }
    if (length(z) > 2.0) {
      return EscapeTime(i, z, true);
    }
    z = mat2(z, -z.y, z.x) * z + uKernel;
  }
}

float smoothColor(EscapeTime et) {
  float smoothed = 5.0 + float(et.n) - logHalfBase - log(log(dot(et.z, et.z))) * logBase;
  return log(smoothed) / log(float(uIterations));
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  EscapeTime et = escape(vComplex);
  float c = smoothColor(et);
  float hue = uHue;
  float value = 0.6 + (0.4 * c);
  if (et.escaped) {
    hue += c;
  } else {
    hue += 0.75;
  }
  vec3 rgb = hsv2rgb(vec3(hue, 1.0, min(value, 0.6)));
  gl_FragColor = vec4(rgb, 1.0);
}
