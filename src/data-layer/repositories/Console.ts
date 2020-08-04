import { LoggerRepositoryInterface } from '../../business-layer/entity-interfaces/Logger';
import { Container } from '../../types';

/**
 * Simple logger implementation
 */
export function createConsoleLogger({ config }: Container): LoggerRepositoryInterface {

  return {
    info: console.log,
    warn: console.warn,
    error: console.error,
    debug: (...params) => {
      if (config.isDevEnv) {
        console.debug(...params)
      }
    }
  }
}
