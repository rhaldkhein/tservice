import IProvider from './interfaces/IProvider';
import ICollection from './interfaces/ICollection';
import IService, { Lifetime } from './interfaces/IService';

export default class Provider implements IProvider {

  private collection?: ICollection;
  private parent?: IProvider;
  private instances: { [token: string]: any } = {};

  constructor(collection?: ICollection, parent?: IProvider) {
    this.collection = collection;
    this.parent = parent;
  }

  createProvider(): IProvider {
    return new Provider(undefined, this);
  }

  resolve<T>(token: string): IService<T> | undefined {

    let service: IService<T> | undefined;
    if (this.collection) {
      service = this.collection.get<T>(token);
    }
    if (!service && this.parent) {
      service = this.parent.resolve<T>(token);
    }
    return service;
  }

  get<T>(token: string): T | null {

    // Find cache service
    let instance: T | null = this.instances[token];
    if (instance) return instance;

    // Get service from collection in here
    let service = this.resolve<T>(token);

    if (service) {

      // Lifetime check
      if (!this.parent && service.lifetime > Lifetime.SINGLETON) {
        throw new Error('Singleton should not require scoped or transient');
      }

      // Create instance
      if (service.lifetime === Lifetime.SCOPED) {
        instance = service.create(this);
        this.instances[token] = instance;
      } else {
        instance = service.create(this);
      }

    }

    return instance;
  }

  setCollection(collection: ICollection) {
    this.collection = collection;
  }

  setParent(parent: IProvider) {
    this.parent = parent;
  }

}
