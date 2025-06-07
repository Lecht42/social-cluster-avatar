import { DataSource } from 'typeorm'
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/entities/*.ts'],
  synchronize: false,
  migrations: ['src/data/migrations/*.ts']
})
