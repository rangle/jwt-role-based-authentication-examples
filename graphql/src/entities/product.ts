import { ObjectType, Field, ID } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('varchar', { length: 100 })
  title: string;

  @Field()
  @Column('varchar', { length: 500 })
  description: string;

  // precision represents total length of value including decimal places
  // scale represents the number of digits after decimal point
  @Field()
  @Column('decimal', { precision: 13, scale: 2, default: 0 })
  price: number;

  // integer between -8388608 and 8388607
  @Field()
  @Column('mediumint')
  count: number;
}
