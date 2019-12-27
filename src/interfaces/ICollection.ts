import IProvider from './IProvider';
import IOption from './IOption';
import IServiceDescriptor from './IServiceDescriptor';

export default interface ICollection {

  configure<T>(token: string, configurator: (provider?: IProvider) => IOption): void;

  get<T>(token: string, own?: any): IServiceDescriptor<T>;

  scoped<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  singleton<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

  transient<T>(token: string, klass: new () => T, creator?: (provider: IProvider) => T): void;

}
