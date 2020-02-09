export interface UserDatabaseGateway {
  findUserById: Function,
}

export class User {
  private userDatabaseGateway: UserDatabaseGateway;
  constructor({ userDatabaseGateway }) {
    this.userDatabaseGateway = userDatabaseGateway;
  }
  findUserById (id) {
    return this.userDatabaseGateway.findUserById(id)
  }
}
