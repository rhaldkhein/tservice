import IProvider from './IProvider'

export enum Lifetime {
  CONCRETE = 0,
  SINGLETON = 1,
  SCOPED = 2,
  TRANSIENT = 3,
}

export default interface IServiceDescriptor<T> {

  creator: (provider: IProvider) => T

  configurator?: (provider: IProvider) => boolean

  enabled: boolean

  lifetime: Lifetime

  value?: T

  create(provider: IProvider): T


}
