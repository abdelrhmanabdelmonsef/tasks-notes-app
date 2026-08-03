import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponseInterface } from '../../modules/interfaces/apiErrorResponse.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, message, error } = this.parseException(exception);

        if (!(exception instanceof HttpException)) {
            this.logger.error(
                `Unhandled exception on ${request.method} ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        const body: ApiErrorResponseInterface = {
            success: false,
            status,
            message,
            timestamp: new Date(),
            path: request.url,
            error,
        };

        response.status(status).json(body);
    }

    private parseException(exception: unknown): {
        status: number;
        message: string;
        error: string;
    } {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                return {
                    status,
                    message: exceptionResponse,
                    error: HttpStatus[status] ?? 'Error',
                };
            }

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObject = exceptionResponse as {
                    message?: string | string[];
                    error?: string;
                    statusCode?: number;
                };

                return {
                    status,
                    message: this.normalizeMessage(responseObject.message),
                    error: responseObject.error ?? HttpStatus[status] ?? 'Error',
                };
            }
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            error: 'Internal Server Error',
        };
    }

    private normalizeMessage(message: string | string[] | undefined): string {
        if (Array.isArray(message)) {
            return message.join(', ');
        }

        if (typeof message === 'string' && message.length > 0) {
            return message;
        }

        return 'An error occurred';
    }
}
