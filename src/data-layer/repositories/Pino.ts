import { Container } from '../../types';

/**
 * Simple logger implementation
 */
export function createPinoLogger({ pino }: Container) {

  return {
    info: pino.info.bind(pino),
    warn: pino.warn.bind(pino),
    error: pino.error.bind(pino),
  }
}
