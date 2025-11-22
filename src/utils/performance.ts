/**
 * Performance Monitoring Utility
 * Tracks and logs performance metrics for the application
 */

import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  start(label: string): void {
    const startTime = performance.now();
    this.metrics.set(label, {
      name: label,
      duration: 0,
      startTime,
      endTime: 0,
    });

    if (this.isDevelopment) {
      logger.debug(`Performance: Started measuring "${label}"`, { startTime });
    }
  }

  end(label: string, shouldLog: boolean = true): number | null {
    const metric = this.metrics.get(label);

    if (!metric) {
      logger.warn(`Performance: Label "${label}" not found`, undefined, 'PerformanceMonitor');
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    if (shouldLog) {
      const isSlowOperation = duration > 1000;
      logger.info(
        `Performance: "${label}" completed in ${duration.toFixed(2)}ms`,
        { duration, label },
        isSlowOperation ? 'SLOW_OPERATION' : 'PerformanceMonitor'
      );
    }

    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    try {
      fn();
    } catch (error) {
      logger.error(`Performance: Error during "${label}"`, error, 'PerformanceMonitor');
      throw error;
    }
    return this.end(label) || 0;
  }

  async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    try {
      await fn();
    } catch (error) {
      logger.error(`Performance: Error during "${label}"`, error, 'PerformanceMonitor');
      throw error;
    }
    return this.end(label) || 0;
  }

  getMetric(label: string): PerformanceMetric | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clear(): void {
    this.metrics.clear();
  }

  printSummary(): void {
    const metrics = this.getAllMetrics();
    if (metrics.length === 0) {
      logger.info('No performance metrics recorded');
      return;
    }

    logger.info('=== Performance Summary ===');
    metrics.forEach((metric) => {
      logger.info(`${metric.name}: ${metric.duration.toFixed(2)}ms`);
    });
  }
}

export const performanceMonitor = new PerformanceMonitor();
