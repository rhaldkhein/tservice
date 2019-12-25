import IProvider from './interfaces/IProvider'
import ICollection from './interfaces/ICollection'

export { IProvider }

export default class Provider implements IProvider {

  private parent: IProvider
  private collection: ICollection

  private createInstance(token: string) {

  }

  get<T>(token: string): T {
    const service = this.collection.get(token)
    return service.create(this) as T
  }

  setCollection(collection: ICollection) {
    this.collection = collection
  }

  setParent(parent: IProvider) {
    this.parent = parent
  }

}