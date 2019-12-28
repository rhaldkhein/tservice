import ICollection from "./ICollection";
import IProvider from "./IProvider";

export default interface IContainer {

  readonly internalProvider: IProvider;

  readonly internalCollection: ICollection;

  internalEmit(method: string): Promise<any>;

  internalInvoke(method: string): Promise<any>;

  // - - -

  build(builder: (collection: ICollection) => void): IContainer;

  createContainer(): IContainer;

  createProvider(): IProvider;

  parent(container: IContainer): void;

  start(): Promise<IProvider>;

}
