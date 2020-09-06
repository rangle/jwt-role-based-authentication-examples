import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @Column({ select: false })
  password: string;

  @Column({
    default: 0,
  })
  tokenVersion: number;
}
