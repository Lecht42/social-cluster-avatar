import axios from 'axios'
import fs from 'fs'
import path from 'path'

export async function generateAvatar(
  prompt: string,
  outputPath?: string
): Promise<Buffer> {
  const url = process.env.SD_WEBUI_URL || 'http://localhost:7860/sdapi/v1/txt2img'

  const payload = {
    prompt,
    width: 512,
    height: 512,
    steps: 30,
    cfg_scale: 7.5,
  }

  const res = await axios.post(url, payload)
  const base64 = res.data.images[0] as string
  const buffer = Buffer.from(base64, 'base64')

  if (outputPath) {
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(outputPath, buffer)
  }

  return buffer
}
