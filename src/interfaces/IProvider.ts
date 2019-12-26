import IServiceDescriptor from './IServiceDescriptor';

export default interface IProvider {

  createProvider(): IProvider;

  resolve<T>(token: string): IServiceDescriptor<T> | undefined;

  get<T>(token: string): T | null;

}
