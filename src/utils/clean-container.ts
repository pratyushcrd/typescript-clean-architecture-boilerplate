import R from 'ramda';

export class Container{
  private componentLevelMap: ComponentLevelMap = {};
  private componentMap: ComponentMap = {};
  private componentSetMap: ComponentSetMap = {};
  private singletonMap: SingletonMap = {};
  constructor(componentSetRaw: (string|string[])[]) {
    const componentSet: string[][] = componentSetRaw.map(el => [].concat(el));
    this.componentLevelMap = creteComponentLevelMap(componentSet);
  }
  register (componentSetName, config: ComponentConfig) {
    for (let componentName in config) {
      const componentConfig = config[componentName]
      componentConfig.type = componentConfig.type || 'classis';
      if (this.componentMap[componentName]) {
        throw Error(`Component ${componentName} is already registered.`)
      }
      this.componentMap[componentName] = componentConfig;
    }
  }
  deregister () {

  }
  static createContainer(input: (string|string[])[]): Container {
    return new Container(input);
  }
  private canAccess(source, dest) {
    return this.componentLevelMap[source] <= this.componentLevelMap[dest];
  }
  private canAccessComponent(sourceComponent, destComponent) {
    const sourceSet = this.componentSetMap[sourceComponent];
    const destSet = this.componentSetMap[destComponent];
    return this.componentLevelMap[sourceSet] <= this.componentLevelMap[destSet];
  }
}


interface ComponentConfig {
  [index: string]: ComponentConfigUnit;
}

interface ComponentConfigUnit {
  component: any,
  as: string;
  type?: string;
}

interface SingletonMap {
  [index: string]: any;
}

interface ComponentSetMap {
  [index: string]: string;
}

interface ComponentMap {
  [index: string]: ComponentConfigUnit;
}

interface ComponentLevelMap {
  [index: string]: number;
}

/**
 * Get a map containing level of all components
*/
function creteComponentLevelMap (componentSet: string[][]): LevelMap {
  return componentSet.reduce((levelMap, components, level) => {
    components.forEach(component => {
      levelMap[component] = level;
    });
    return levelMap;
  }, {})
}
