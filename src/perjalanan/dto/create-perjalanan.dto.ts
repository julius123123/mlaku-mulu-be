import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePerjalananDto {
  @IsUUID()
  turisId: string;

  @IsDateString()
  tanggalMulaiPerjalanan: string;

  @IsDateString()
  tanggalBerakhirPerjalanan: string;

  @IsNotEmpty()
  destinasiPerjalanan: string | Record<string, unknown>;
}
