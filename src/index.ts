import { createSystemContainer } from './containers/system'
// import { User } from './business-layer/entities/User'
// import { AddUserEvent } from './business-layer/use-cases/user/AddUser'

let env: string = process.env.NODE_ENV || 'development'
const envVariables = process.env

if (env === 'dev') {
  env = 'development';
}

const system = createSystemContainer(env, envVariables)

const app: any = system.resolve('app')
const logger: any = system.resolve('logger')

function exitHandler (exitCode: number, message: string) {
  return function (error) {
    logger.error(message, error);
    process.exit(exitCode);
  }
}

function asyncExitHandler(handler: Function) {
  return async function (error) {
    logger.error('Error occured, shutting down application.')
    await app.stop().catch(e => e)
    return handler(error)
  }
}

process.on('uncaughtException', asyncExitHandler(exitHandler(1, 'Unexpected Error: ')))
process.on('unhandledRejection', asyncExitHandler(exitHandler(1, 'Unhandled Promise: ')))
process.on('SIGTERM', exitHandler(0, 'sigterm'))
process.on('SIGINT', exitHandler(0, 'sigint'))

logger.info('Starting Application.')
app.start()
  .catch(exitHandler(1, 'Failure in application startup: '))
  .then(() => {
    // const AddUser: any = system.resolve('addUser')
    // const event: AddUserEvent = AddUser(
    //   new User()
    //     .setEmail('pratyush.creed@gmail.com')
    //     .setPhone('7980748696')
    //     .setName('Pratyush')
    // )
    // event.on(AddUserEvent.emits.error, (err) => {
    //   logger.info('Error:', err.message)
    // })
    // event.on(AddUserEvent.emits.user_exists, (user) => {
    //   logger.info('User already exists: ', user.email)
    // })
    // event.on(AddUserEvent.emits.success, (user) => {
    //   logger.info('User added: ', user.email)
    // })
  })

