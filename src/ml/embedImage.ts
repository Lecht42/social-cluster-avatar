import * as ort from 'onnxruntime-node'
import { Image } from 'image-js'
import resize from '@jsquash/resize'

export async function embedImage(imageBuffer: Buffer): Promise<number[]> {
  const inputSize = 224

  const img = await Image.load(imageBuffer)

  const imgRGB = img.rgba8().crop({ x: 0, y: 0, width: img.width, height: img.height })
  const { width, height, data } = imgRGB
  const imageData = new ImageData(new Uint8ClampedArray(data), width, height)
  const resized = await resize(imageData, { width: inputSize, height: inputSize })

  const floatArray = new Float32Array(inputSize * inputSize * 3)
  let j = 0
  for (let i = 0; i < data.length; i += 4) {
    floatArray[j++] = data[i] / 255  
    floatArray[j++] = data[i + 1] / 255
    floatArray[j++] = data[i + 2] / 255
  }

  const transposed = new Float32Array(3 * inputSize * inputSize)
  for (let i = 0; i < inputSize * inputSize; i++) {
    transposed[i] = floatArray[i * 3]
    transposed[i + inputSize * inputSize] = floatArray[i * 3 + 1]
    transposed[i + 2 * inputSize * inputSize] = floatArray[i * 3 + 2]
  }

  const tensor = new ort.Tensor('float32', transposed, [
    1,
    3,
    inputSize,
    inputSize,
  ])

  const session = await ort.InferenceSession.create(
    process.env.CLIP_ONNX_PATH || 'models/clip_image.onnx',
    { executionProviders: ['CUDAExecutionProvider'] }
  )

  const results = await session.run({ image: tensor })
  const embedding = results['image_embedding'] as ort.Tensor
  return Array.from(embedding.data as Float32Array)
}
