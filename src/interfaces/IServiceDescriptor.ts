import IProvider from './IProvider';

export enum Lifetime {
  CONCRETE = 0,
  SINGLETON = 1,
  SCOPED = 2,
  TRANSIENT = 3,
}

export default interface IServiceDescriptor<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => boolean;

  enabled: boolean;

  klass?: new (provider: IProvider, option: (provider: IProvider) => any, service: IServiceDescriptor<T>) => T;

  lifetime: Lifetime;

  value?: T;

  /**
   * Methods
   */

  create(provider: IProvider): T | null;

}
