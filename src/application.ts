import { LifeCycle } from './util/LifeCycle'
import { Container } from './types'

export class Application extends LifeCycle {
  private container: Container
  constructor (container: Container) {
    super()
    this.container = container
  }
  async start () {
    const container = this.container
    const { mongoPrimary } = container
    await mongoPrimary.start()
    console.log('Application started!')
  }
  async stop () {
    const container = this.container
    const { mongoPrimary } = container
    await mongoPrimary.stop()
    console.log('Application stopped!')
  }
}