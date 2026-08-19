import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Heritage } from './heritage.model.js';
import { User } from './user.model.js';
@Entity({ name: 'heritage_versions' })
export class HeritageVersion {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid' })
  heritageId: string;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'json' })
  canonicalData: object;

  @Column({ type: 'varchar', length: 64 })
  dataHash: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @ManyToOne(() => Heritage, heritage => heritage.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'heritageId' })
  heritage: Relation<Heritage>;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: Relation<User>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

