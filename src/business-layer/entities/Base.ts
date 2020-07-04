export default class Entity {
  toObject(): any {
    return {
      ...this
    }
  }
}