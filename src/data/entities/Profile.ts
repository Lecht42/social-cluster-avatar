import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Embedding } from './Embedding';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ unique: true })
  pseudonym: string | undefined;  

  @Column()
  consent: boolean | undefined;   

  @CreateDateColumn()
  createdAt: Date | undefined;

  @OneToMany(() => Embedding, emb => emb.profile)
  embeddings: Embedding[] | undefined;
}
