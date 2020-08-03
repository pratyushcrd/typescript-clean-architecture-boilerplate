import { createSystemContainer } from './containers/system'
// import { User } from './business-layer/entities/User'
// import { AddUserEvent } from './business-layer/use-cases/user/AddUser'

const env: string = 'development' || process.env.NODE_ENV
const envVariables = process.env

const system = createSystemContainer(env, envVariables)

const app: any = system.resolve('app')

// function exitHandler () {
// }

// process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
// process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'))
// process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
// process.on('SIGINT', exitHandler(0, 'SIGINT'))

app.start()
  .then(() => {
    // const AddUser: any = system.resolve('addUser')
    // const event: AddUserEvent = AddUser(
    //   new User()
    //     .setEmail('pratyush.creed@gmail.com')
    //     .setPhone('7980748696')
    //     .setName('Pratyush')
    // )
    // event.on(AddUserEvent.emits.error, (err) => {
    //   console.log('Error:', err.message)
    // })
    // event.on(AddUserEvent.emits.user_exists, (user) => {
    //   console.log('User already exists: ', user.email)
    // })
    // event.on(AddUserEvent.emits.success, (user) => {
    //   console.log('User added: ', user.email)
    // })
  })

