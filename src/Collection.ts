import ICollection from "./interfaces/ICollection";
import IProvider from "./interfaces/IProvider";
import IOption from "./interfaces/IOption";
import IServiceConstructor from "./interfaces/IServiceConstructor";
import IServiceDescriptor, { Lifetime } from "./interfaces/IServiceDescriptor";
import ServiceDescriptor from "./ServiceDescriptor";

export default class Collection implements ICollection {

  private services: Array<IServiceDescriptor<any>> = [];
  private tokens: { [token: string]: number } = {};
  private parent?: ICollection;

  constructor(parent?: ICollection) {
    this.parent = parent;
  }

  /**
   * Internal methods
   */

  public internalGet<T>(token: string, own?: boolean): IServiceDescriptor<T> {
    const service = this.services[this.tokens[token]];
    if (!service && !own && this.parent) {
      return this.parent.internalGet(token, own);
    }
    return service;
  }

  public get internalServices(): Array<IServiceDescriptor<any>> {
    return this.services;
  }

  public internalSetParent(collection: ICollection): void {
    this.parent = collection;
  }

  /**
   * Public methods
   */

  public add<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void {
    this.singleton(token, klass, creator);
  }

  public configure(token: string, configurator: (provider: IProvider) => IOption): void {
    const service = this.internalGet(token);
    service.configurator = configurator;
  }

  public scoped<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void {
    const service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SCOPED;
    this.push<T>(token, service);
  }

  public singleton<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void {
    const service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.SINGLETON;
    this.push<T>(token, service);
  }

  public transient<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void {
    const service = new ServiceDescriptor<T>(token);
    service.creator = creator;
    service.klass = klass;
    service.lifetime = Lifetime.TRANSIENT;
    this.push<T>(token, service);
  }

  /**
   * Private methods
   */

  private push<T>(token: string, service: IServiceDescriptor<T>): void {
    this.services.push(service);
    this.tokens[token] = this.services.length - 1;
    const klass = service.klass;
    if (klass && klass.__service__ === true) {
      if (klass.setup) {
        klass.setup(service.token);
      }
    }
  }

}
