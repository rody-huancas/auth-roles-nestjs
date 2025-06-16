import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateActionDto {
    @IsNotEmpty({ message: "El nombre es obligatorio" })
    @IsString({ message: "El nombre debe ser una cadena" })
    name: string;
  
    @IsOptional()
    @IsString({ message: "La descripción debe ser una cadena" })
    description: string;
}
