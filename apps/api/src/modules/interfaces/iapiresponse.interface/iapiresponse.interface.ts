import { HttpStatus } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IsObject } from "class-validator";

export class IapiresponseInterface <t>{
    @IsString()
    @IsNotEmpty()
    message!: string;
    @IsObject()
    @IsNotEmpty()
    data!: t | t[];
    @IsNumber()
    @IsNotEmpty()
    status!: HttpStatus;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        sortField: string;
        sortOrder: string;
    };


}
