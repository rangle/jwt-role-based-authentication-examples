import { registerAs } from '@nestjs/config';
import { Product } from 'src/module/product/product.entity';
import { User } from 'src/module/user/user.entity';

export default registerAs('mysqlDatabase', () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === 'true',
  synchronize: process.env.DB_SYNC === 'true',
  entities: [Product, User],
  port: parseInt(process.env.DB_PORT, 10),
}));
