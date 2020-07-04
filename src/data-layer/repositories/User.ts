import { ObjectId } from 'mongodb'
import Joi from '@hapi/joi'
import { Container, Collection } from '../../types'
import { UserRepositoryInterface } from '../../business-layer/entity-interfaces/User'
import { User } from '../../business-layer/entities/User'

export interface DbUserInterface {
  _id: ObjectId;
  email: string;
  name: string;
  phone: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

const emailSchema = Joi.string()
  .email()
const nameSchema = Joi.string()
  .min(3)
const phoneSchema = Joi.string()
  .length(10)
  .regex(/[0-9]{10}/)
const passwordSchema = Joi.string()
  .min(10)
const dateSchema = Joi.date()

const MakeUserSchema = Joi.object({
  _id: Joi.required(),
  email: emailSchema.required(),
  name: nameSchema,
  phone: phoneSchema,
  password_hash: passwordSchema,
  created_at: dateSchema.required(),
  updated_at: dateSchema.required(),
})

const makeFindByEmail = (userCollection: Collection) => async (email: string): Promise<User | null> => {
  const foundUser: DbUserInterface | null = await userCollection.findOne({ email });
  if (!foundUser) {
    return null;
  }
  return new User()
    .setId(String(foundUser._id))
    .setName(foundUser.name)
    .setEmail(foundUser.email)
    .setPhone(foundUser.phone)
    .setPasswordHash(foundUser.password_hash)
    .setCreatedAt(foundUser.created_at)
    .setUpdatedAt(foundUser.updated_at)
}

const makeCreateNewUser = (userCollection: Collection) => async (user: User) => {
  if (!user.id) {
    user.setId(new ObjectId().toString())
  }
  if (!user.createdAt) {
    user.setCreatedAt()
  }
  if (!user.updatedAt) {
    user.setUpdatedAt()
  }
  const existingUser = await userCollection.findOne({
    email: user.email
  })
  if (existingUser) {
    throw Error(
      `A user with the email '${user.email}' already exists.`
    )
  }
  const dbUser = {
    _id: new ObjectId(user.id),
    email: user.email,
    name: user.name,
    phone: user.phone,
    password_hash: user.passwordHash,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  }
  const validation = MakeUserSchema.validate(dbUser)
  if (validation.error) {
    throw validation.error
  }
  return userCollection.insertOne(dbUser)
    .then(() => user)
}

/**
 * User Repository implementation
 * @param param0 
 */
export function createUserRepository({
  mongoPrimary
}: Container): UserRepositoryInterface {

  const {
    userCollection,
  } = mongoPrimary.get();

  return {
    findByEmail: makeFindByEmail(userCollection),
    createNewUser: makeCreateNewUser(userCollection)
  }
}
