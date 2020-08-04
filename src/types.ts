import { Config } from './config'
import { UserRepositoryInterface } from './business-layer/entity-interfaces/User'
import { LoggerRepositoryInterface } from './business-layer/entity-interfaces/Logger'
import { User } from './business-layer/entities/User'
// Lifecycle components
import { LifeCycle } from './util/LifeCycle'
import { AddUserEvent } from './business-layer/use-cases/user/AddUser'


export { ActiveMongoPrimaryDriver } from './data-layer/drivers/MongoPrimaryDbDriver'
export { Config } from './config'
export { Db, Collection } from 'mongodb'

export interface Container {
  config: Config;
  app: LifeCycle;
  pino: any;
  userRepository: UserRepositoryInterface;
  mongoPrimary: LifeCycle;
  logger: LoggerRepositoryInterface,
  expressServer: LifeCycle,

  // use cases
  addUser: (User) => AddUserEvent;
}