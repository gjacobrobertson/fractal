export default (width, height, cx, cy, zx, zy) => {
  return ([x, y]) => {
    let xOffset = (x / width) * zx
    let yOffset = (y / height) * zy
    return [cx - zx / 2 + xOffset, cy - zy / 2 + yOffset]
  }
}
