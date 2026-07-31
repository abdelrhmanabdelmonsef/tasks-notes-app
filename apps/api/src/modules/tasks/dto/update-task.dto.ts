import { PartialType } from "@nestjs/mapped-types";
import { CreateTasksDto, Priority } from "./Create-Tasks.dto";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, IsNotEmpty, IsObject } from "class-validator";
import { UserEntity } from "src/modules/users/entities/users.entity/users.entity";

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;     
    
    @IsOptional()
    @IsInt()
    @Min(1)
    user_id?: number;
}
