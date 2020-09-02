import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import mysqlDB from 'src/config/mysqlDB.config';
import { AppService } from './app.service';
import { ProductModule } from './module/product/product.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    /** Load and parse .env files from the environments directory */
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [mysqlDB],
      isGlobal: true,
    }),
    /** Configure TypeOrm asynchronously. */
    TypeOrmModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<MysqlConnectionOptions> => configService.get('mysqlDatabase'),
      inject: [ConfigService],
    }),
    ProductModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
