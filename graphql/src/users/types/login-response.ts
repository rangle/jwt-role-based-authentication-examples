import { ObjectType, Field } from 'type-graphql';
import { User } from '../../entities/user';

@ObjectType({})
export class LoginResponse {
  @Field()
  user: User;

  @Field()
  accessToken: string;
}
