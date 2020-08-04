import { LoggerRepositoryInterface } from '../../business-layer/entity-interfaces/Logger';
import { Container } from '../../types';

const errorParamsSorter = (a, b) => {
  if (a instanceof Error) {
    return -1
  }
  if (b instanceof Error) {
    return 1
  }
  return 0
}

/**
 * Simple logger implementation
 */
export function createPinoLogger({ pino, config }: Container): LoggerRepositoryInterface {

  return {
    info: (...params) => pino.info(...params),
    warn: (...params) => pino.warn(...params),
    error: (...params) => pino.error(...params.sort(errorParamsSorter)),
    debug: (...params) => {
      if (config.isDevEnv) {
        pino.debug(...params)
      }
    }
  }
}
