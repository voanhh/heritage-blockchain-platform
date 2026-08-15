import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'blockchain_records' })
export class BlockchainRecord {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ type: 'uuid' })
  heritageId: string;
  @Column({ type: 'varchar', length: 64 })
  dataHash: string;
  @Column({ type: 'int' })
  version: number;
  @Column({ type: 'varchar' })
  verifier: string;
  @Column({ type: 'varchar', nullable: true })
  transactionHash?: string;
  @Column({ type: 'int', nullable: true })
  blockNumber?: number;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

