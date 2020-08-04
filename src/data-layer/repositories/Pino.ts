import { LoggerRepositoryInterface } from '../../business-layer/entity-interfaces/Logger';
import { Container } from '../../types';

/**
 * Simple logger implementation
 */
export function createPinoLogger({ pino }: Container): LoggerRepositoryInterface {

  return {
    info: pino.info.bind(pino),
    warn: pino.warn.bind(pino),
    error: pino.error.bind(pino),
  }
}
