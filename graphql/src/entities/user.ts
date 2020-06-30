import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Root } from 'type-graphql';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager', // can add products
  CUSTOMER = 'customer', // can purchase
  GUEST = 'guest', // can view shop pages
}

// Create a database table `User`
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true, length: 255 })
  email: string;

  @Field()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // GraphQL schema
  // Resolve the `name` field for the User type
  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // Database column
  // Cannot be queried by client
  @Column()
  password: string;
}
