import IProvider from './interfaces/IProvider'
import ICollection from './interfaces/ICollection'
import { Lifetime } from './interfaces/IServiceDescriptor'

export { IProvider }

export default class Provider implements IProvider {

  private parent: IProvider
  private collection: ICollection
  private instances: { [token: string]: any } = {}

  constructor(collection?: ICollection, parent?: IProvider) {
    this.setCollection(collection)
    this.setParent(parent)
  }

  get<T>(token: string): T {

    // Find cache service
    let instance: T = this.instances[token]
    if (instance) return instance

    // Get service from here
    let service = this.collection && this.collection.get<T>(token)

    // Resolve from parent
    if (!service) return this.parent && this.parent.get<T>(token)

    switch (service.lifetime) {
      case Lifetime.SINGLETON:
        if (this.parent) {
          throw new Error('Singleton service can only be used in singleton provider')
        }
        break;
      case Lifetime.SCOPED:
        if (!this.parent) {
          throw new Error('Singleton service can only be used in singleton provider')
        }
        break;
    }

    // if (!this.parent && service.lifetime > Lifetime.SINGLETON) {
    //   throw new Error('Singleton should not get scoped or transient')
    // }

    // No instance
    if (service.lifetime === Lifetime.SCOPED) {
      instance = service.create(this)
      this.instances[token] = instance
    } else {
      instance = service.create(this) as T
    }
    return instance
  }

  setCollection(collection: ICollection) {
    this.collection = collection
  }

  setParent(parent: IProvider) {
    this.parent = parent
  }

}