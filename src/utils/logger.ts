/**
 * Logger Utility
 * Centralized logging system for the application
 * Supports multiple log levels and structured logging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  context?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const contextStr = context ? ` [${context}]` : '';
    return `${timestamp} [${level}]${contextStr} ${message}`;
  }

  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const formatted = this.formatMessage(entry);

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formatted, entry.data ? entry.data : '');
        break;
      case LogLevel.INFO:
        console.info(formatted, entry.data ? entry.data : '');
        break;
      case LogLevel.WARN:
        console.warn(formatted, entry.data ? entry.data : '');
        break;
      case LogLevel.ERROR:
        console.error(formatted, entry.data ? entry.data : '');
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log({ timestamp: this.getTimestamp(), level: LogLevel.DEBUG, message, data, context });
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log({ timestamp: this.getTimestamp(), level: LogLevel.INFO, message, data, context });
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log({ timestamp: this.getTimestamp(), level: LogLevel.WARN, message, data, context });
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log({ timestamp: this.getTimestamp(), level: LogLevel.ERROR, message, data, context });
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = new Logger();
