import { HDBSCAN } from 'hdbscan-ts'

export function clusterVectors(
  vectors: number[][],
  minClusterSize = 15
): number[] {
  if (!Array.isArray(vectors) || vectors.length === 0) {
    return []
  }
  const hdb = new HDBSCAN({ minClusterSize })
  hdb.fit(vectors)
  return hdb.labels_
}
