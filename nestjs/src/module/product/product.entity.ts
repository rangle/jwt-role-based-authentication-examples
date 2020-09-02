import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', { length: 500 })
  description: string;

  // precision represents total length of value including decimal places
  // scale represents the number of digits after decimal point
  @Column('decimal', { precision: 13, scale: 2, default: 0 })
  price: number;

  // integer between -8388608 and 8388607
  @Column('mediumint')
  count: number;
}
