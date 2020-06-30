import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User, UserRole } from '../../entities/user';

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @Length(1, 15)
  firstName: string;

  @Field()
  @Length(1, 15)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  role: UserRole;
}
