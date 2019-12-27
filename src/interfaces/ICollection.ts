import IProvider from './IProvider';
import IOption from './IOption';
import IService from './IService';

export default interface ICollection {

  internalServices(): IService<any>[];

  internalGet<T>(token: string, own?: any): IService<T>;

  // - - -

  add<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  configure(token: string, configurator: (provider?: IProvider) => IOption): void;

  scoped<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  singleton<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  transient<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

}
