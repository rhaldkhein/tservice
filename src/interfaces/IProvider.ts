import IService from './IService';
import ICollection from './ICollection';

export default interface IProvider {

  createProvider(): IProvider;

  resolve<T>(token: string): IService<T> | undefined;

  get<T>(token: string): T;

  getOrNull<T>(token: string): T | null;

  setCollection(collection: ICollection): void;

  setParent(parent: IProvider): void;

}
