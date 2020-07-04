import Joi from '@hapi/joi'
import Entity from './Base'

const idSchema = Joi.string()
  .alphanum()
  .min(15)
const emailSchema = Joi.string()
  .email()
const nameSchema = Joi.string()
  .min(3)
const phoneSchema = Joi.string()
  .length(10)
  .regex(/[0-9]{10}/)
const passwordHashSchema = Joi.string()
  .min(20)
const dateSchema = Joi.date()

export class User extends Entity {
  id?: string;
  email?: string;
  name?: string;
  phone?: string;
  passwordHash?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {
    super()
  }

  setId(id: string) {
    const validation = idSchema.validate(id);
    if (validation.error) {
      throw validation.error
    }
    this.id = id
    return this
  }

  setEmail(email: string) {
    const validation = emailSchema.validate(email);
    if (validation.error) {
      throw validation.error
    }
    this.email = email
    return this
  }

  setName(name) {
    const validation = nameSchema.validate(name);
    if (validation.error) {
      throw validation.error
    }
    this.name = name
    return this
  }

  setPhone(phone) {
    const validation = phoneSchema.validate(phone);
    if (validation.error) {
      throw validation.error
    }
    this.phone = phone
    return this
  }

  setPasswordHash(passwordHash) {
    const validation = passwordHashSchema.validate(passwordHash);
    if (validation.error) {
      throw validation.error
    }
    this.passwordHash = passwordHash
    return this
  }

  setCreatedAt(createdAt?: Date) {
    const validation = dateSchema.validate(createdAt);
    if (validation.error) {
      throw validation.error
    }
    this.createdAt = createdAt || new Date();
    return this
  }

  setUpdatedAt(updatedAt?: Date) {
    const validation = dateSchema.validate(updatedAt);
    if (validation.error) {
      throw validation.error
    }
    this.updatedAt = updatedAt || new Date();
    return this
  }
}
