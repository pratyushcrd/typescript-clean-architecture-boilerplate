import { EventEmitter } from 'events'
import { Container } from '../../../types'
import { User } from '../../entities/User'

export class AddUserEvent extends EventEmitter {
  static emits = {
    success: Symbol.for('success'),
    user_exists: Symbol.for('user_exists'),
    error: Symbol.for('error'),
  }
}

export function makeAddUser ({ userRepository }: Container) {
  return function AddUser(user: User): AddUserEvent {
    const output = new AddUserEvent()

    userRepository.createNewUser(user)
      .then(user => {
        output.emit(AddUserEvent.emits.success, user)
      })
      .catch((error: Error) => {
        if (~error.message.indexOf('already exists')) {
          return output.emit(AddUserEvent.emits.user_exists, user)
        }
        return output.emit(AddUserEvent.emits.error, error.message)
      })
    return output
  }
}
