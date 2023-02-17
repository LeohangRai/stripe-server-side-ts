import { IsNotEmpty, IsNumber, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MaxLength(20)
    firstName: string;

    @IsNotEmpty()
    @MaxLength(20)
    lastName: string;

    @IsNotEmpty()
    @IsNumber()
    age: number
}