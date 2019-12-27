import ICollection from './interfaces/ICollection';
import IProvider from './interfaces/IProvider';
import IOption from './interfaces/IOption';
import IService, { Lifetime, ServiceConstructor } from './interfaces/IService';
import Service from './Service';

export default class Collection implements ICollection {

  private services: IService<any>[] = [];
  private tokens: { [token: string]: number } = {};
  private parent?: ICollection;

  constructor(parent?: ICollection) {
    this.parent = parent;
  }

  /**
   * Private methods
   */

  private push<T>(token: string, service: IService<T>) {
    this.services.push(service);
    this.tokens[token] = this.services.length - 1;
  }

  /**
   * Internal methods
   */

  internalServices(): IService<any>[] {
    return this.services;
  }

  /**
   * Public methods
   */


  add<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    this.singleton(token, klass, creator);
  }

  configure(token: string, configurator: (provider: IProvider) => IOption): void {
    const service = this.get(token);
    service.configurator = configurator;
  }

  get<T>(token: string, own?: boolean): IService<T> {
    const service = this.services[this.tokens[token]];
    if (!service && !own && this.parent) {
      return this.parent.get(token, own);
    }
    return service;
  }

  scoped<T>(token: string, klass: ServiceConstructor, creator?: (provider: IProvider) => T): void {
    var service = new Service<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SCOPED;
    this.push<T>(token, service);
  }

  setParent(collection: ICollection) {
    this.parent = collection;
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
