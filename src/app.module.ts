import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Pegawai } from './pegawai/pegawai.entity';
import { PegawaiModule } from './pegawai/pegawai.module';
import { Perjalanan } from './perjalanan/perjalanan.entity';
import { PerjalananModule } from './perjalanan/perjalanan.module';
import { Turis } from './turis/turis.entity';
import { TurisModule } from './turis/turis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASS ?? '',
      database: process.env.DATABASE_NAME ?? 'mlaku_mulu',
      entities: [Pegawai, Turis, Perjalanan],
      synchronize: true, // nonaktifkan di production
    }),
    AuthModule,
    PegawaiModule,
    TurisModule,
    PerjalananModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
