import { ApiResponse } from "./types";

export function successResponse<T>(
    data: T,
    message?: string
): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
}

export function errorResponse(
    error: string,
    message?: string
): ApiResponse {
    return {
        success: false,
        error,
        message,
        timestamp: new Date().toISOString(),
    };
}

export function validationErrorResponse(
    errors: Record<string, string[]>
): ApiResponse {
    return {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Validation failed",
        data: errors,
        timestamp: new Date().toISOString(),
    };
}
