import IContainer from './interfaces/IContainer';
import ICollection from './interfaces/ICollection';
import IProvider from './interfaces/IProvider';
import EventEmitter from './EventEmitter';
import Collection from './Collection';
import Provider from './Provider';

export default class Container extends EventEmitter implements IContainer {

  private collection: ICollection;
  private provider: IProvider;
  isReady: boolean = false;

  constructor() {
    super();
    this.collection = new Collection();
    this.provider = new Provider(this.collection);
    this.provider.internalSetCollection(this.collection);
  }

  get internalCollection(): ICollection {
    return this.collection;
  }

  get internalProvider(): IProvider {
    return this.provider;
  }

  build(builder: (collection: ICollection) => void): IContainer {
    builder(this.collection);
    return this;
  }

  createContainer(): IContainer {
    const container = new Container();
    container.parent(this);
    return container;
  }

  createProvider(): IProvider {
    return this.internalProvider.createProvider();
  }

  parent(container: IContainer) {
    this.collection.internalSetParent(container.internalCollection);
    this.provider.internalSetParent(container.internalProvider);
  }

  async start(): Promise<IProvider> {
    if (this.isReady) return Promise.resolve(this.provider);
    await this.emit('start', this.provider);
    this.isReady = true;
    await this.emit('ready', this.provider);
    return this.provider;
  }

}
