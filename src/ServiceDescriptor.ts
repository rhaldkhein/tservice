import IProvider from './interfaces/IProvider'
import { Lifetime } from './interfaces/IServiceDescriptor'

export default class ServiceDescriptor<T> {

  creator: (provider: IProvider) => T

  configurator?: (provider: IProvider) => boolean

  enabled: boolean = true

  lifetime: Lifetime = Lifetime.SINGLETON

  value?: T

  create(provider: IProvider) {

    if (!this.enabled)
      throw new Error('Unable to create disabled service')

    if (this.lifetime <= Lifetime.SINGLETON) {
      if (!this.value) this.value = this.creator(provider)
      return this.value
    }

    return this.creator(provider)
  }

}