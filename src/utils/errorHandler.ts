/**
 * Error Handler Utility
 * Centralized error handling and reporting
 */

import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

class ErrorHandler {
  private isDevelopment: boolean;
  private errorLog: Array<{ error: Error; timestamp: Date }> = [];
  private maxErrorLogSize: number = 100;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private storeError(error: Error): void {
    this.errorLog.push({
      error,
      timestamp: new Date(),
    });

    if (this.errorLog.length > this.maxErrorLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxErrorLogSize);
    }
  }

  handle(error: Error, context?: string): void {
    this.storeError(error);

    if (error instanceof AppError) {
      logger.error(
        `${error.message} (Code: ${error.code})`,
        {
          code: error.code,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
        },
        context || 'AppError'
      );
    } else {
      logger.error(error.message, { stack: error.stack }, context || 'UnexpectedError');
    }
  }

  handleAsync(error: unknown, context?: string): void {
    if (error instanceof Error) {
      this.handle(error, context);
    } else {
      logger.error('Unknown error occurred', { error }, context || 'UnknownError');
    }
  }

  getErrorLog(): Array<{ error: Error; timestamp: Date }> {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  logValidationError(field: string, message: string, context?: string): void {
    logger.warn(`Validation Error: ${field} - ${message}`, { field }, context || 'Validation');
  }

  logAuthError(reason: string, context?: string): void {
    logger.warn(`Authentication Error: ${reason}`, undefined, context || 'Auth');
  }

  logSecurityIssue(issue: string, context?: string): void {
    logger.error(`Security Issue: ${issue}`, undefined, context || 'Security');
  }
}

export const errorHandler = new ErrorHandler();
