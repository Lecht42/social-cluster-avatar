import { Router } from 'express'
import { clusterVectors } from '../ml/cluster'

const router = Router()

router.post('/', (req, res) => {
  try {
    const { vectors } = req.body as { vectors?: number[][] }

    let labels: number[] = []
    if (Array.isArray(vectors) && vectors.length > 0) {
      labels = clusterVectors(vectors)
    }
    return res.json({ clusters: labels })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Clustering error' })
  }
})

export default router
