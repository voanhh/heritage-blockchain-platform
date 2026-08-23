import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Heritage } from './heritage.model.js';
import { User } from './user.model.js';
export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity({ name: 'verifications' })
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'uuid' })
  heritageId: string;

  @Column({ type: 'uuid', nullable: true })
  reviewerId: string;

  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  status: VerificationStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Heritage, heritage => heritage.verifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'heritageId' })
  heritage: Relation<Heritage>;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reviewerId' })
  reviewer: Relation<User>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}


