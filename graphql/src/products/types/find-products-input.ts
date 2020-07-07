import { InputType, Field } from 'type-graphql';

@InputType()
export class FindProductsInput {
  @Field({ nullable: true })
  filter?: string;
}
