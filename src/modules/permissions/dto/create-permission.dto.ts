import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  description: string;

  @IsNotEmpty({ message: 'El módulo es obligatorio' })
  @IsString({ message: 'El ID del módulo debe ser una cadena' })
  systemModuleId: string;

  @IsNotEmpty({ message: 'La acción es obligatoria' })
  @IsString({ message: 'El ID de la acción debe ser una cadena' })
  actionId: string;
}
