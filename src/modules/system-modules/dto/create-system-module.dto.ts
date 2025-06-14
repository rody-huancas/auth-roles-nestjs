import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateSystemModuleDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @IsOptional()
  @IsString({ message: 'El icono debe ser una cadena de texto' })
  icon: string;

  @IsOptional()
  @IsNumber({}, { message: 'La orden debe ser un número' })
  order: number;

  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un Booleano ' })
  isActive: boolean;
}
