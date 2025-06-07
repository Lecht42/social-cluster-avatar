type Edge = [number, number]

interface Node2VecOptions {
  dimensions?: number
  walkLength?: number
  numWalks?: number
  windowSize?: number
  p?: number
  q?: number
}

export async function embedGraph(
  edges: Edge[],
  opts: Node2VecOptions = {}
): Promise<Record<number, number[]>> {
  const {
    dimensions = 64,
    walkLength = 10,
    numWalks = 80,
    windowSize = 5,
    p = 1,
    q = 1,
  } = opts

  const adj = new Map<number, number[]>()
  edges.forEach(([u, v]) => {
    if (!adj.has(u)) adj.set(u, [])
    if (!adj.has(v)) adj.set(v, [])
    adj.get(u)!.push(v)
    adj.get(v)!.push(u)
  })

  function randomWalk(start: number): number[] {
    const walk: number[] = [start]
    for (let i = 1; i < walkLength; i++) {
      const curr = walk[i - 1]
      const neighbors = adj.get(curr) || []
      if (neighbors.length === 0) break
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      walk.push(next)
    }
    return walk
  }

  const walks: number[][] = []
  const nodes = Array.from(adj.keys())
  for (const node of nodes) {
    for (let i = 0; i < numWalks; i++) {
      walks.push(randomWalk(node))
    }
  }

 
  const word2vec = require('word2vec')
  const corpusPath = '/tmp/node2vec_corpus.txt'
  const fs = require('fs')
  const stream = fs.createWriteStream(corpusPath)
  walks.forEach((walk) => {
    stream.write(walk.join(' ') + '\n')
  })
  stream.end()

  await new Promise<void>((res, rej) => {
    word2vec.word2vec(
      corpusPath,
      '/tmp/node2vec_model.bin',
      {
        size: dimensions,
        window: windowSize,
        cbow: 0,
        iter: 5,
      },
      (err: any) => {
        if (err) return rej(err)
        res()
      }
    )
  })

  const model = await new Promise<any>((res, rej) => {
    word2vec.loadModel('/tmp/node2vec_model.bin', (err: any, m: any) => {
      if (err) return rej(err)
      res(m)
    })
  })

  const embeddings: Record<number, number[]> = {}
  nodes.forEach((node: number) => {
    try {
      embeddings[node] = model.getVector(node.toString()).values
    } catch {
      embeddings[node] = Array(dimensions).fill(0)
    }
  })

  return embeddings
}
