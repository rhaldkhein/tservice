import ICollection from './interfaces/ICollection'
import IProvider from './interfaces/IProvider'
import IServiceDescriptor, { Lifetime } from './interfaces/IServiceDescriptor'
import ServiceDescriptor from './ServiceDescriptor'

export { ICollection }

export default class Collection implements ICollection {

  private services: any[] = []
  private tokens: object = {}

  add<T>(token: string, klass: new (p: IProvider) => T, creator?: (provider: IProvider) => T): void {
    this.singleton(token, klass, creator)
  }

  configure(token: string, configurator: (provider: IProvider) => any): void {
    const service = this.get(token)
    service.configurator = configurator
  }

  get<T>(token: string, own?: any): IServiceDescriptor<T> {
    return this.services[this.tokens[token]]
  }

  private push<T>(token: string, service: IServiceDescriptor<T>) {
    this.services.push(service)
    this.tokens[token] = this.services.length - 1
  }

  scoped<T>(token: string, klass: new (p: IProvider) => T, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>()
    service.creator = creator || ((provider) => new klass(provider))
    service.lifetime = Lifetime.SCOPED
    this.push<T>(token, service)
  }

  singleton<T>(token: string, klass: new (p: IProvider) => T, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>()
    service.creator = creator || ((provider) => new klass(provider))
    service.lifetime = Lifetime.SINGLETON
    this.push<T>(token, service)
  }

  transient<T>(token: string, klass: new (p: IProvider) => T, creator?: (provider: IProvider) => T): void {
    var service = new ServiceDescriptor<T>()
    service.creator = creator || ((provider) => new klass(provider))
    service.lifetime = Lifetime.TRANSIENT
    this.push<T>(token, service)
  }

}
