import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.model.js';
import { HeritageVersion } from './heritage-version.model.js';
import { Verification } from './verification.model.js';
import { BlockchainRecord } from './blockchain-record.model.js';

export enum HeritageStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  PUBLISHED = 'PUBLISHED'
}

@Entity({ name: 'heritages' })
export class Heritage {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'varchar', unique: true })
  heritageCode: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  source: string;

  @Column({ type: 'varchar' })
  sourceOrganization: string;

  @Column({ type: 'text' })
  sourceReference: string;

  @Column({ type: 'enum', enum: HeritageStatus, default: HeritageStatus.DRAFT })
  status: HeritageStatus;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, user => user.createdHeritages, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @OneToMany(() => HeritageVersion, version => version.heritage)
  versions: HeritageVersion[];

  @OneToMany(() => Verification, verification => verification.heritage)
  verifications: Verification[];

  @OneToMany(() => BlockchainRecord, record => record.heritage)
  blockchainRecords: BlockchainRecord[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
