import request from 'supertest'
import { app } from '..'

jest.mock('../ml/embedText', () => ({
  embedText: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
}));
jest.mock('../ml/embedImage', () => ({
  embedImage: jest.fn().mockResolvedValue([0.9, 0.8, 0.7]),
}));
jest.mock('../ml/embedGraph', () => ({
  embedGraph: jest.fn().mockResolvedValue([0.4, 0.5, 0.6]),
}));
jest.mock('../ml/generateAvatar', () => ({
  generateAvatar: jest.fn().mockResolvedValue(Buffer.alloc(10)),
}));

describe('API endpoints', () => {
  it('POST /vectorize returns valid response', async () => {
    const res = await request(app)
      .post('/vectorize')
      .send({
        text: 'hello world',
        graphEdges: [[0, 1], [1, 2]],
        image: null
      })
      .expect(200)

    expect(res.body).toHaveProperty('textEmbedding')
    expect(res.body).toHaveProperty('graphEmbedding')
    expect(res.body).toHaveProperty('imageEmbedding')
  })

  it('POST /cluster returns cluster labels', async () => {
    const res = await request(app)
      .post('/cluster')
      .send({
        vectors: [[0.1, 0.2], [0.8, 0.9]]
      })
      .expect(200)

    expect(res.body).toHaveProperty('clusters')
    expect(Array.isArray(res.body.clusters)).toBe(true)
  })

  it('POST /generate-avatar returns PNG image', async () => {
    const res = await request(app)
      .post('/generate-avatar')
      .send({ prompt: 'a futuristic cartoon avatar' })
      .expect(200)

    expect(res.headers['content-type']).toMatch(/image\/png/)
    expect(res.body).toBeInstanceOf(Buffer)
  })
})
