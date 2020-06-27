import production from './production.json';
import development from './development.json';

interface Config {
  isDevEnv: Boolean;
  isProdEnv: Boolean;
  serverPort: Number;
}

interface NodeEnvConfig {
  [index: string]: string | Number;
}

const EnvConfigMap = {
  development: development,
  production: production
}

export default function makeConfig(envName: string, envConfig: NodeEnvConfig): Config {
  const staticConfig = EnvConfigMap[envName];

  // if wrong env name is provided; throw error
  if (!staticConfig) {
    throw Error(`env name ${envName} is improper. env should be one of ${Object.keys(EnvConfigMap).join('|')}.`)
  }

  const envOrStatic = (key: string, defaultVal?) => {
    const result = envConfig[key] || staticConfig[key];
    // when the defaultValue is undefined, data must be present in config
    // or else throw error
    if (!result && result !== '' && isNaN(result) && defaultVal === undefined) {
      throw Error(`key: "${key}", not found in either static or env config (env: ${envName}).`)
    }
    return result || defaultVal;
  }

  return {
    isDevEnv: envName === 'development',
    isProdEnv: envName === 'production',
    serverPort: +envOrStatic('server.port'),
  }
}
