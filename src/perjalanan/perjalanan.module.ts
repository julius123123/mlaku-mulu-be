import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perjalanan } from './perjalanan.entity';
import { PerjalananController } from './perjalanan.controller';
import { PerjalananService } from './perjalanan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Perjalanan])],
  controllers: [PerjalananController],
  providers: [PerjalananService],
  exports: [PerjalananService],
})
export class PerjalananModule {}
