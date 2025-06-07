import { Router } from 'express'
import { embedText } from '../ml/embedText'
import { embedGraph } from '../ml/embedGraph'
import { embedImage } from '../ml/embedImage'

const router = Router()


router.post('/', async (req, res) => {
  try {
    const { text, graphEdges, image } = req.body as {
      text: string
      graphEdges: [number, number][]
      image?: string | null
    }

   const textEmbedding = text ? await embedText(text) : []

   const graphEmbedding = Array.isArray(graphEdges)
      ? await embedGraph(graphEdges)
      : {}

    let imageEmbedding: number[] | null = null
    if (typeof image === 'string' && image.startsWith('data:image')) {
      const base64 = image.split(',')[1]
      const buffer = Buffer.from(base64, 'base64')
      imageEmbedding = await embedImage(buffer)
    }

    return res.json({ textEmbedding, graphEmbedding, imageEmbedding })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Vectorization error' })
  }
})

export default router
