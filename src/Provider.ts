import IProvider from './interfaces/IProvider'
import ICollection from './interfaces/ICollection'

export default class Provider implements IProvider {

  private collection: ICollection

  _setCollection(collection: ICollection) {
    this.collection = collection
  }

  get<T>(token: string): T {
    const service = this.collection.get(token)
    return service.create(this) as T
  }


}