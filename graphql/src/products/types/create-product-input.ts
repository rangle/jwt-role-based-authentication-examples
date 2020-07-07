import { InputType, Field } from 'type-graphql';
import { Product } from '../../entities/product';
import { Length } from 'class-validator';

@InputType()
export class CreateProductInput implements Partial<Product> {
  @Field()
  @Length(1, 100)
  title: string;

  @Field()
  @Length(1, 500)
  description: string;

  @Field()
  price: number;

  @Field()
  count: number;
}
