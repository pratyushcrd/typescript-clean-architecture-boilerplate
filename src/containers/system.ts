import { asFunction, asClass, asValue, createContainer } from 'awilix'
import { Container } from '../types'
import { Application } from '../application'
import { ExpressServer } from '../presentation-layer/drivers/Express'
import { makeConfig } from '../config'
import { MongoPrimaryDbDriver } from '../data-layer/drivers/MongoPrimaryDbDriver'
import { createUserRepository } from '../data-layer/repositories/User'
import { makeAddUser } from '../business-layer/use-cases/user/AddUser'
import { createPinoLogger } from '../data-layer/repositories/Pino'
import { makePino } from '../data-layer/drivers/Pino'

export function createSystemContainer (env: string, envVariables: any) {
  const container = createContainer<Container>()
  const config = makeConfig(env, envVariables)

  container.register({
    config: asValue(config),
    app: asClass(Application),
    pino: asFunction(makePino),
    expressServer: asClass(ExpressServer),

    logger: asFunction(createPinoLogger),

    mongoPrimary: asClass(MongoPrimaryDbDriver)
      .singleton(),
    userRepository: asFunction(createUserRepository)
      .singleton(),
    // register use-cases
    addUser: asFunction(makeAddUser)
      .singleton(),
      
  })

  return container
}