import IProvider from './IProvider';
import IOption from './IOption';

export enum Lifetime {
  CONCRETE = 0,
  SINGLETON = 1,
  SCOPED = 2,
  TRANSIENT = 3,
}

export type ServiceConstructor = new (
  p: IProvider,
  option: IOption,
  token: string
) => any;

export default interface IService<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => IOption;

  enabled: boolean;

  klass?: ServiceConstructor;

  lifetime: Lifetime;

  token: string;

  value?: T;

  /**
   * Methods
   */

  create(provider: IProvider): T | null;

}
