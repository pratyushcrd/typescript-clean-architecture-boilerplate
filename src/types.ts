import { Config } from './config'
import { UserRepositoryInterface } from './business-layer/entity-interfaces/User'
import { User } from './business-layer/entities/User'
// Lifecycle components
import { LifeCycle } from './util/LifeCycle'
import { AddUserEvent } from './business-layer/use-cases/user/AddUser'

interface Logger {
  info: Function;
  warn: Function;
  error: Function;
}

export { ActiveMongoPrimaryDriver } from './data-layer/drivers/MongoPrimaryDbDriver'
export { Config } from './config'
export { Db, Collection } from 'mongodb'

export interface Container {
  config: Config;
  app: LifeCycle;
  pino: any;
  userRepository: UserRepositoryInterface;
  mongoPrimary: LifeCycle;
  logger: Logger,
  expressServer: LifeCycle,

  // use cases
  addUser: (User) => AddUserEvent;
}