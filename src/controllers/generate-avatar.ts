import { Router } from 'express'
import { generateAvatar } from '../ml/generateAvatar'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body as { prompt: string }
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const base = prompt.trim()
    const modifiers = [
      'human',
      'close-up face',
      'headshot',
      '50mm portrait',
      'high detail',
      'cartoon style',
      'thick lines',
      'vibrant colors'
    ]
    const fullPrompt = `${modifiers.join(', ')}, ${base}`

    const buffer = await generateAvatar(fullPrompt)
    res.set('Content-Type', 'image/png')
    return res.send(buffer)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Avatar generation error' })
  }
})

export default router
