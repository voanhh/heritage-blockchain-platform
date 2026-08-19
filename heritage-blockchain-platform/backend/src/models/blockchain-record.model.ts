import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Heritage } from './heritage.model.js';
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

  @ManyToOne(() => Heritage, heritage => heritage.blockchainRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'heritageId' })
  heritage: Relation<Heritage>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

