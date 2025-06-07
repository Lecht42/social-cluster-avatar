import { clusterVectors } from "../ml/cluster"

describe('HDBSCAN clustering', () => {
  it('кластеризує прості 2D-точки', () => {
    const points = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [10, 10],
      [10, 11],
      [11, 10],
    ]
    const labels = clusterVectors(points, 2)

    const firstLabel = labels[0]
    const secondLabel = labels[4]
    for (let i = 0; i < 4; i++) {
      expect(labels[i]).toBe(firstLabel)
    }
    for (let i = 4; i < 7; i++) {
      expect(labels[i]).toBe(secondLabel)
    }
    expect(firstLabel).not.toBe(secondLabel)
  })

  it('повертає пустий масив, якщо векторів немає', () => {
    const labels = clusterVectors([], 2)
    expect(labels).toEqual([])
  })
})
