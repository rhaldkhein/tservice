import ICollection from './interfaces/ICollection';
import IProvider from './interfaces/IProvider';
import IOption from './interfaces/IOption';
import IServiceDescriptor, { Lifetime, Service } from './interfaces/IServiceDescriptor';
import ServiceDescriptor from './ServiceDescriptor';

export default class Collection implements ICollection {

  private services: any[] = [];
  private tokens: { [token: string]: number } = {};
  private parent?: ICollection;

  constructor(parent?: ICollection) {
    this.parent = parent;
  }

  add<T>(token: string, klass: Service, creator?: (provider: IProvider) => T): void {
    this.singleton(token, klass, creator);
  }

  configure(token: string, configurator: (provider: IProvider) => IOption): void {
    const service = this.get(token);
    service.configurator = configurator;
  }

  get<T>(token: string, own?: boolean): IServiceDescriptor<T> {
    const service = this.services[this.tokens[token]];
    if (!service && !own && this.parent) {
      return this.parent.get(token, own);
    }
    return service;
  }

  private push<T>(token: string, service: IServiceDescriptor<T>) {
    this.services.push(service);
    this.tokens[token] = this.services.length - 1;
  }

  scoped<T>(token: string, klass: Service, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SCOPED;
    this.push<T>(token, service);
  }

  setParent(collection: ICollection) {
    this.parent = collection;
  }

  singleton<T>(token: string, klass: Service, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SINGLETON;
    this.push<T>(token, service);
  }

  transient<T>(token: string, klass: Service, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.TRANSIENT;
    this.push<T>(token, service);
  }

}
