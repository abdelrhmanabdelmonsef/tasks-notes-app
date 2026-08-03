import { Role } from '../rolse/rolse.enum';

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
}
