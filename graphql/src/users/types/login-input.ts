import { InputType, Field } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { User } from '../../entities/User';

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
