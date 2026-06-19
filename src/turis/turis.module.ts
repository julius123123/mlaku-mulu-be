import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerjalananModule } from '../perjalanan/perjalanan.module';
import { TurisController } from './turis.controller';
import { Turis } from './turis.entity';
import { TurisService } from './turis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Turis]), PerjalananModule],
  providers: [TurisService],
  controllers: [TurisController],
  exports: [TurisService],
})
export class TurisModule {}
