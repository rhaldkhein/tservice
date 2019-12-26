import IProvider from './interfaces/IProvider';
import ICollection from './interfaces/ICollection';
import IServiceDescriptor, { Lifetime } from './interfaces/IServiceDescriptor';

export { IProvider };

export default class Provider implements IProvider {

  private collection?: ICollection;
  private parent?: IProvider;
  private instances: { [token: string]: any } = {};

  constructor(collection?: ICollection, parent?: IProvider) {
    this.collection = collection;
    this.parent = parent;
  }

  create<T>(token: string): T {
    // Find cache service
    let instance: T = this.instances[token];
    if (instance) return instance;

    // Get service from here
    let service: IServiceDescriptor<T>;
    if (this.collection) {
      service = this.collection.get<T>(token);
    }

    // Resolve from parent
    if (service === null) return null


    if (!this.parent && service.lifetime > Lifetime.SINGLETON) {
      throw new Error('Singleton should not require scoped or transient');
    }

    // No instance
    if (service.lifetime === Lifetime.SCOPED) {
      instance = service.create(this);
      this.instances[token] = instance;
    } else {
      instance = service.create(this) as T;
    }
    return instance;
  }

  get<T>(token: string): T {
    return {} as T;
  }

  setCollection(collection: ICollection) {
    this.collection = collection;
  }

  setParent(parent: IProvider) {
    this.parent = parent;
  }

}