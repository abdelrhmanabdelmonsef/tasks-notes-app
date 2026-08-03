import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsEnum, IsObject, Min, IsInt } from "class-validator";


export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}

export class CreateTasksDto {
    @IsNotEmpty()
    @IsString()
    title!: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsBoolean()
    completed?: boolean = false;
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    user_id!: number;
}
