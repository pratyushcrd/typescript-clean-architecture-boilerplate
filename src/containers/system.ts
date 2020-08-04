import { asFunction, asClass, asValue, createContainer } from 'awilix'
import { Container } from '../types'
import { Application } from '../application'
import { ExpressServer } from '../presentation-layer/drivers/Express'
import { makeConfig } from '../config'
import { MongoPrimaryDbDriver } from '../data-layer/drivers/MongoPrimaryDbDriver'
import { createUserRepository } from '../data-layer/repositories/User'
import { makeAddUser } from '../business-layer/use-cases/user/AddUser'
import { createPinoLogger } from '../data-layer/repositories/Pino'
import { createConsoleLogger } from '../data-layer/repositories/Console'
import { getPinoDriver } from '../data-layer/drivers/PinoLogger'

export function createSystemContainer(env: string, envVariables: any) {
  const container = createContainer<Container>()
  const config = makeConfig(env, envVariables)

  container.register({
    config: asValue(config),
    // registering data/presenter drivers
    app: asClass(Application).singleton(),
    pino: asFunction(getPinoDriver).singleton(),
    expressServer: asClass(ExpressServer).singleton(),
    logger: asFunction(config.useConsole ? createConsoleLogger : createPinoLogger).singleton(),
    mongoPrimary: asClass(MongoPrimaryDbDriver).singleton(),
    // registering data repositories
    userRepository: asFunction(createUserRepository).singleton(),
    // registering controllers
    // register use-cases
    addUser: asFunction(makeAddUser).singleton(),
  })

  return container
}
