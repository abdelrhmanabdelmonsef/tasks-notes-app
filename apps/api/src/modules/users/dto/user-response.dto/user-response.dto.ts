import { IsNotEmpty, IsString } from "class-validator";
import { UserEntity } from "../../entities/users.entity/users.entity";
import { HttpStatus } from "@nestjs/common";

export class UserResponseDto {
   
    id!: number;
    username!: string;
    email!: string;
    


}
