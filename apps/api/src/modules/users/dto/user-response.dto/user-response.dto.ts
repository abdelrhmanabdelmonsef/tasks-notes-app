
import { Role } from "src/modules/auth/rolse/rolse.enum";


export class UserResponseDto {
    id!: number;
    username!: string;
    email!: string;
    role!: Role;
    
}
