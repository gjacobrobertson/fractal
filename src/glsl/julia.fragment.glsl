precision mediump float;

struct EscapeTime {
  int n;
  vec2 z;
  bool escaped;
};

const float logBase = 1.0 / log(2.0);
const float logHalfBase = log(0.5) * logBase;
const int iterations = 30;

uniform vec2 uKernel;
uniform float uHue;

varying vec2 vComplex;

EscapeTime escape(vec2 c) {
  vec2 z = c;
  for (int i = 0; i < iterations; i++) {
    if (length(z) > 2.0) {
      return EscapeTime(i, z, true);
    }
    z = mat2(z, -z.y, z.x) * z + uKernel;
  }
  return EscapeTime(0, z, false);
}

float smoothColor(EscapeTime et) {
  float smoothed = 5.0 + float(et.n) - logHalfBase - log(log(et.z.x * et.z.x + et.z.y * et.z.y)) * logBase;
  // return smoothed / float(iterations);
  return log(smoothed) / log(float(iterations));
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
  if (et.escaped) {
    hue += c;
  } else {
    hue += 0.75;
  }
  vec3 rgb = hsv2rgb(vec3(hue, 1.0, 0.8));
  gl_FragColor = vec4(rgb, 1.0);
}
