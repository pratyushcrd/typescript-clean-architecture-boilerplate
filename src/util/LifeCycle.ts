export abstract class LifeCycle {
  private component: any;
  abstract start(): Promise<any>;
  abstract stop(): Promise<any>;
  // save is an internal method to be used
  // only in the implementation of start method
  // to save the connected component
  protected save (component: any) {
    this.component = component;
  }
  get () {
    return this.component;
  }
}