import IProvider from './IProvider';
import IOption from './IOption';

export enum Lifetime {
  CONCRETE = 0,
  SINGLETON = 1,
  SCOPED = 2,
  TRANSIENT = 3,
}

type ServiceA = new (p: IProvider) => any;
type ServiceB = new (p: IProvider, option: IOption) => any;
type ServiceC = new (p: IProvider, option: IOption, token: string) => any;
export type Service = ServiceA | ServiceB | ServiceC;

export default interface IService<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => IOption;

  enabled: boolean;

  klass?: Service;

  lifetime: Lifetime;

  token: string;

  value?: T;

  /**
   * Methods
   */

  create(provider: IProvider): T | null;

}
