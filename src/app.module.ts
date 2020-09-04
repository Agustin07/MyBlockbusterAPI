import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { UserSubscriber } from './users/subscribers/user.subscriber';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'agustin',
      password: 'applaudo',
      database: 'blockbuster_db',
      synchronize: true,
      autoLoadEntities: true,
      subscribers: [UserSubscriber,"dist/**/subscribers/*.{js,ts}"]
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
