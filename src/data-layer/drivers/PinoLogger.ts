import pino from 'pino';
import { Container } from '../../types';

export function getPinoDriver({ config }: Container) {
  // @ts-ignore
  return pino({
    name: config.appName,
  });
}
