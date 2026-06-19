import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PerjalananService } from '../perjalanan/perjalanan.service';
import { CreateTurisDto } from './dto/create-turis.dto';
import { UpdateTurisDto } from './dto/update-turis.dto';
import { TurisService } from './turis.service';

@Controller('turis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurisController {
  constructor(
    private readonly turisService: TurisService,
    private readonly perjalananService: PerjalananService,
  ) {}

  // self-access — harus di atas /:id agar tidak bentrok
  @Get('me')
  @Roles('turis')
  getMe(@CurrentUser() user: { id: string }) {
    return this.turisService.findOne(user.id);
  }

  @Get('me/perjalanan')
  @Roles('turis')
  getMyPerjalanan(@CurrentUser() user: { id: string }) {
    return this.perjalananService.findByTurisId(user.id);
  }

  // CRUD by pegawai
  @Get()
  @Roles('pegawai')
  findAll() {
    return this.turisService.findAll();
  }

  @Get(':id')
  @Roles('pegawai')
  findOne(@Param('id') id: string) {
    return this.turisService.findOne(id);
  }

  @Post()
  @Roles('pegawai')
  create(@Body() dto: CreateTurisDto) {
    return this.turisService.create(dto);
  }

  @Put(':id')
  @Roles('pegawai')
  update(@Param('id') id: string, @Body() dto: UpdateTurisDto) {
    return this.turisService.update(id, dto);
  }

  @Delete(':id')
  @Roles('pegawai')
  remove(@Param('id') id: string) {
    return this.turisService.remove(id);
  }
}
