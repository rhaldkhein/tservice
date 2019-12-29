import IProvider from "./IProvider";
import IOption from "./IOption";
import IServiceDescriptor from "./IServiceDescriptor";
import IServiceConstructor from "./IServiceConstructor";

export default interface ICollection {

  readonly internalServices: Array<IServiceDescriptor<any>>;

  internalGet<T>(token: string, own?: any): IServiceDescriptor<T>;

  internalSetParent(collection: ICollection): void;

  // - - -

  add<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void;

  configure(token: string, configurator: (provider?: IProvider) => IOption): void;

  scoped<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void;

  singleton<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void;

  transient<T>(token: string, klass: IServiceConstructor, creator?: (provider: IProvider) => T): void;

}
