import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePerjalananDto } from './dto/create-perjalanan.dto';
import { UpdatePerjalananDto } from './dto/update-perjalanan.dto';
import { PerjalananService } from './perjalanan.service';

@Controller('perjalanan')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('pegawai')
export class PerjalananController {
  constructor(private readonly perjalananService: PerjalananService) {}

  @Get()
  findAll() {
    return this.perjalananService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perjalananService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePerjalananDto) {
    return this.perjalananService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePerjalananDto) {
    return this.perjalananService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perjalananService.remove(id);
  }
}
