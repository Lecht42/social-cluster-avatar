import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class Embedding {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @ManyToOne(() => Profile, profile => profile.embeddings, { onDelete: 'CASCADE' })
  profile: Profile | undefined;

  @Column("double precision", { array: true, nullable: true })
  textEmbedding: number[] | undefined;

  @Column("double precision", { array: true, nullable: true })
  imageEmbedding: number[] | undefined;

  @Column("double precision", { array: true, nullable: true })
  graphEmbedding: number[] | undefined;

  @Column({ nullable: true })
  clusterId: number | undefined;
}
