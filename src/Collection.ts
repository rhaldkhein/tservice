import ICollection from './interfaces/ICollection';
import IProvider from './interfaces/IProvider';
import IOption from './interfaces/IOption';
import IServiceDescriptor, { Lifetime, ServiceConstructor } from './interfaces/IServiceDescriptor';
import Service from './ServiceDescriptor';

export default class Collection implements ICollection {

  private services: IServiceDescriptor<any>[] = [];
  private tokens: { [token: string]: number } = {};
  private parent?: ICollection;

  constructor(parent?: ICollection) {
    this.parent = parent;
  }

  /**
   * Private methods
   */

  private push<T>(token: string, service: IServiceDescriptor<T>): void {
    this.services.push(service);
    this.tokens[token] = this.services.length - 1;
    if (service.klass) {
      // const klass = service.klass as any;
      // console.log(klass.prototype.prototype);
      // if (klass.prototype klass.setup) klass.setup(service.token);
    }
  }

  /**
   * Internal methods
   */

  internalGet<T>(token: string, own?: boolean): IServiceDescriptor<T> {
    const service = this.services[this.tokens[token]];
    if (!service && !own && this.parent) {
      return this.parent.internalGet(token, own);
    }
    return service;
  }

  internalServices(): IServiceDescriptor<any>[] {
    return this.services;
  }

  internalSetParent(collection: ICollection): void {
    this.parent = collection;
  }

  /**
   * Public methods
   */

  add<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    this.singleton(token, klass, creator);
  }

  configure(token: string, configurator: (provider: IProvider) => IOption): void {
    const service = this.internalGet(token);
    service.configurator = configurator;
  }

  scoped<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    var service = new Service<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SCOPED;
    this.push<T>(token, service);
  }

  singleton<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    var service = new Service<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SINGLETON;
    this.push<T>(token, service);
  }

  transient<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    var service = new Service<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.TRANSIENT;
    this.push<T>(token, service);
  }

}
