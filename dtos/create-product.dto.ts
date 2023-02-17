import { IsNotEmpty, IsNumber, IsNumberString, Min } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;
}