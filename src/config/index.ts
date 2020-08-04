import production from './production.json';
import development from './development.json';

export interface Config {
  isDevEnv: boolean;
  isProdEnv: boolean;
  serverPort: number;
  appName: string;
  env: string;
  serverHost: string;
  mongoPrimaryUrl: string;
  mongoPrimaryDbName: string;
  corsWhitelist: string;
  ddosBurst: number;
  useConsole: boolean;
  ddosLimit: number;
}

export interface NodeEnvConfig {
  [index: string]: string | Number;
}

const EnvConfigMap = {
  development: development,
  production: production
}

const envOrStaticGetter = (envName, envConfig, staticConfig) => (key: string, defaultVal?) => {
  const result = envConfig[key] || staticConfig[key];
  // when the defaultValue is undefined, data must be present in config
  // or else throw error
  if (!result && result !== '' && isNaN(result) && defaultVal === undefined) {
    throw Error(`key: "${key}", not found in either static or env config (env: ${envName}).`)
  }
  return result || defaultVal;
}

const isPresentGetter = (envConfig, staticConfig) => (...keys: string[]): boolean => {
  return keys
    .map((key = '') => envConfig[key] || staticConfig[key])
    .filter(it => it)
    .length !== 0;
}

export function makeConfig(envName: string, envConfig: any = {}): Config {
  const staticConfig = EnvConfigMap[envName];

  // if wrong env name is provided; throw error
  if (!staticConfig) {
    throw Error(`env name ${envName} is improper. env should be one of ${Object.keys(EnvConfigMap).join('|')}.`)
  }

  const envOrStatic = envOrStaticGetter(envName, envConfig, staticConfig);
  const isPresentInConfig = isPresentGetter(envConfig, staticConfig);

  const isDevEnv = envName === 'development';
  let useConsole = isDevEnv;

  if (isPresentInConfig('usePino', 'use.pino')) {
    useConsole = false;
  }
  if (isPresentInConfig('useConsole', 'use.console')) {
    useConsole = true;
  }

  return {
    appName: envOrStatic('app.name', 'system'),
    isDevEnv,
    isProdEnv: envName === 'production',
    env: envName,
    useConsole,
    serverPort: +envOrStatic('server.port'),
    serverHost: envOrStatic('server.host', 'localhost'),
    corsWhitelist: envOrStatic('cors.whitelist', '').split(','),
    mongoPrimaryUrl: envOrStatic('mongo.primary.url'),
    mongoPrimaryDbName: envOrStatic('mongo.primary.db.name'),
    ddosBurst: +envOrStatic('ddos.burst', 20),
    ddosLimit: +envOrStatic('ddos.limit', 20),
  }
}
