import IServiceDescriptor from "./IServiceDescriptor";
import ICollection from "./ICollection";

export default interface IProvider {

  internalResolve<T>(token: string): IServiceDescriptor<T> | undefined;

  internalSetCollection(collection: ICollection): void;

  internalSetParent(parent: IProvider): boolean;

  // - - -

  createProvider(): IProvider;

  get<T>(token: string): T | null;

  getRequired<T>(token: string): T;

  getOrNull<T>(token: string): T | null;

  getNames(): string[];

}
