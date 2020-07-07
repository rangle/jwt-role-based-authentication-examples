import { ObjectType, Field } from 'type-graphql';

@ObjectType({})
export class DeleteProductResponse {
  @Field()
  message: string;

  @Field()
  id: string;
}
