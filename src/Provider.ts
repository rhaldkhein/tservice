import IProvider from "./interfaces/IProvider";
import ICollection from "./interfaces/ICollection";
import IServiceDescriptor, { Lifetime } from "./interfaces/IServiceDescriptor";

interface IKeyValPair {
  [token: string]: any;
}

export default class Provider implements IProvider {

  public static mock(deps: IKeyValPair): IProvider {
    const provider = new Provider();
    for (const key in deps) {
      if (deps.hasOwnProperty(key)) {
        const value = deps[key];
        if (typeof value === "function") {
          deps[key] = value();
        }
      }
    }
    provider.internalSetInstances(deps);
    return provider;
  }

  private collection?: ICollection;
  private parent?: IProvider;
  private instances: IKeyValPair = {};

  constructor(collection?: ICollection, parent?: IProvider) {
    this.collection = collection;
    this.parent = parent;
  }

  /**
   * Internal methods
   */

  public internalResolve<T>(token: string): IServiceDescriptor<T> | undefined {

    let service: IServiceDescriptor<T> | undefined;
    if (this.collection) {
      service = this.collection.internalGet<T>(token);
    }
    if (!service && this.parent) {
      service = this.parent.internalResolve<T>(token);
    }
    return service;
  }

  public internalSetCollection(collection: ICollection): void {
    this.collection = collection;
  }

  public internalSetParent(parent: IProvider): void {
    this.parent = parent;
  }

  public internalSetInstances(instances: IKeyValPair): void {
    this.instances = instances;
  }

  /**
   * Public methods
   */

  public createProvider(): IProvider {
    return new Provider(undefined, this);
  }

  public get<T>(token: string): T {
    const instance = this.getOrNull<T>(token);
    if (!instance) {
      throw new Error("Missing service: " + token);
    }
    return instance;
  }

  public getOrNull<T>(token: string): T | null {

    // Find cache service
    let instance: T | null = this.instances[token];
    if (instance) {
      return instance;
    }

    // Get service from collection in here
    const service = this.internalResolve<T>(token);

    if (service) {

      // Lifetime check
      if (!this.parent && service.lifetime > Lifetime.SINGLETON) {
        throw new Error("Singleton should not require scoped or transient");
      }

      // Create instance
      if (service.lifetime === Lifetime.SCOPED) {
        instance = service.create(this);
        this.instances[token] = instance;
      } else {
        instance = service.create(this);
      }

    }

    return instance || null;
  }

}
