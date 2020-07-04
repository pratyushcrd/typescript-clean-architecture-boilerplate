import { Config } from './config'
import { UserRepositoryInterface } from './business-layer/entity-interfaces/User'
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
  userRepository: UserRepositoryInterface;
  mongoPrimary: LifeCycle;

  // use cases
  addUser: (User) => AddUserEvent;
}