import ICollection from "./ICollection";
import IProvider from "./IProvider";
import IEventEmitter from "./IEventEmitter";

export default interface IContainer extends IEventEmitter {

  readonly isReady: boolean;

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
