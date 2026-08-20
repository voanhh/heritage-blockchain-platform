import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model.js";

@Entity('refresh_token')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ type: "varchar", length: 512, unique: true })
  token: string //// opaque random hex, không phải JWT

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'device_id', type: 'varchar', length: 128, default: 'default' })
  deviceId?: string

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date

  @Column({ name: 'is_revoked', type: 'boolean', default: false })
  isRevoked?: boolean

  @Column({ name: 'replaced_by', type: 'varchar', nullable: true })
  replacedBy?: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date
}
