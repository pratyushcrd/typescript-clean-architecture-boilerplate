import { asFunction, asClass, asValue, createContainer } from 'awilix'
import { Container } from '../types'
import { Application } from '../application'
import { makeConfig } from '../config'
import { MongoPrimaryDbDriver } from '../data-layer/drivers/MongoPrimaryDbDriver'
import { createUserRepository } from '../data-layer/repositories/User'
import { makeAddUser } from '../business-layer/use-cases/user/AddUser'

export function createSystemContainer (env: string, envVariables: any) {
  const container = createContainer<Container>()
  const config = makeConfig(env, envVariables)

  container.register({
    config: asValue(config),
    app: asClass(Application),
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