import { LoggerRepositoryInterface } from '../../business-layer/entity-interfaces/Logger';

/**
 * Simple logger implementation
 */
export function createConsoleLogger(): LoggerRepositoryInterface {

  return {
    info: console.log,
    warn: console.warn,
    error: console.error,
  }
}
