export default async function resizeMock() {
  return {
    width: 224,
    height: 224,
    data: new Uint8ClampedArray(224 * 224 * 4),
  }
}
