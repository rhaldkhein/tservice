import IService from './IService';

export default interface IProvider {

  createProvider(): IProvider;

  resolve<T>(token: string): IService<T> | undefined;

  get<T>(token: string): T | null;

}
