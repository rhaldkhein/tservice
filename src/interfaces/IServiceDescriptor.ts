import IProvider from './IProvider';
import IOption from './IOption';
import IServiceConstructor from './IServiceConstructor';

export enum Lifetime {
  CONCRETE = 0,
  SINGLETON = 1,
  SCOPED = 2,
  TRANSIENT = 3,
}

export default interface IServiceDescriptor<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => IOption;

  enabled: boolean;

  klass?: IServiceConstructor;

  lifetime: Lifetime;

  token: string;

  value?: T;

  /**
   * Methods
   */

  create(provider: IProvider): T | null;

}
