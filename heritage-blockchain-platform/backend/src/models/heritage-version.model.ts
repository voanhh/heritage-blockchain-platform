import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

