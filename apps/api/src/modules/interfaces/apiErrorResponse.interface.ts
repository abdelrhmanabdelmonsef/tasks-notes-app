
export interface ApiErrorResponseInterface {
    success: boolean;
    status: number;
    message: string;
    timestamp: Date;
    path: string;
    error: string;
}