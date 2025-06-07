
import express from 'express'
import vectorizeRouter from './controllers/vectorize'
import clusterRouter from './controllers/cluster'
import avatarRouter from './controllers/generate-avatar'

const app = express()

app.use(express.json())


app.use('/vectorize', vectorizeRouter)
app.use('/cluster', clusterRouter)
app.use('/generate-avatar', avatarRouter)

app.listen(3000, '0.0.0.0', () => {
  console.log('API сервер слухає на 0.0.0.0:3000');
});

export { app }
