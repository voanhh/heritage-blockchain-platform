import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../types/rbac.js';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar' })
  passwordHash: string;
  @Column({ type: 'varchar' })
  fullName: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

