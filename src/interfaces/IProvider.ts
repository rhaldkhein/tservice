import IService from './IService';
import ICollection from './ICollection';

export default interface IProvider {

  internalResolve<T>(token: string): IService<T> | undefined;

  internalSetCollection(collection: ICollection): void;

  internalSetParent(parent: IProvider): void;

  // - - - 

  createProvider(): IProvider;

  get<T>(token: string): T;

  getOrNull<T>(token: string): T | null;

}
