import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  @Column({ type: 'uuid' })
  reviewerId: string;
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  status: VerificationStatus;
  @Column({ type: 'text', nullable: true })
  notes?: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

