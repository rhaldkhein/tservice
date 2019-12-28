import IProvider from './IProvider';
import IOption from './IOption';
import IServiceDescriptor from './IServiceDescriptor';

export default interface ICollection {

  readonly internalServices: IServiceDescriptor<any>[];

  internalGet<T>(token: string, own?: any): IServiceDescriptor<T>;

  internalSetParent(collection: ICollection): void;

  // - - -

  add<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  configure(token: string, configurator: (provider?: IProvider) => IOption): void;

  scoped<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  singleton<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  transient<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

}
