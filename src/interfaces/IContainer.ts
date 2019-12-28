import ICollection from './ICollection';
import IProvider from './IProvider';

export default interface IContainer {

  readonly internalProvider: IProvider;

  readonly internalCollection: ICollection;

  build(builder: (collection: ICollection) => void): IContainer;

  createContainer(): IContainer;

  createProvider(): IProvider;

  start(): Promise<IProvider>;

}
