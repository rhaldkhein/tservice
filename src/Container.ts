import IContainer from './interfaces/IContainer';
import ICollection from './interfaces/ICollection';
import IProvider from './interfaces/IProvider';
import EventEmitter from './EventEmitter';
import Collection from './Collection';
import Provider from './Provider';

export default class Container extends EventEmitter implements IContainer {

  private collection: ICollection;
  isReady: boolean = false;

  constructor() {
    super(new Provider());
    this.collection = new Collection();
    this.provider.internalSetCollection(this.collection);
  }

  build(builder: (collection: ICollection) => void): IContainer {
    builder(this.collection);
    return this;
  }

  async start(): Promise<IProvider> {
    if (this.isReady) return Promise.resolve(this.provider);
    await this.emit('start');
    this.isReady = true;
    await this.emit('ready');
    return this.provider;
  }

}
