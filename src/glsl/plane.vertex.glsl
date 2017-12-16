attribute vec2 aVertex;

uniform vec2 uCenter;
uniform vec2 uScale;

varying vec2 vComplex;

void main() {
  gl_Position = vec4(aVertex.x, aVertex.y, 0.0, 1.0);
  vComplex = uCenter + aVertex * uScale;
}
