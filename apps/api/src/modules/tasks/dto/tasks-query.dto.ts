import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";
import { Priority } from "./Create-Tasks.dto";
import { Transform } from "class-transformer";

export class TasksQueryDto {

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' ? true : value === 'false' ? false : value)
    completed?: boolean;
    @IsOptional()
    @IsEnum(Priority)
    priority?: Priority;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsEnum(['id', 'title', 'priority'])
    sortField?: 'id' | 'title' | 'priority';
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';
}
