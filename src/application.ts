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
    const { mongoPrimary, expressServer} = container
    // start data drivers first
    await mongoPrimary//.start()
    // then start controllers to maintain dependency
    await expressServer.start()
  }
  async stop () {
    const container = this.container
    const { mongoPrimary } = container
    await mongoPrimary.stop()
  }
}