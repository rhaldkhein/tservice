import IContainer from "./interfaces/IContainer";
import ICollection from "./interfaces/ICollection";
import IProvider from "./interfaces/IProvider";
import EventEmitter from "./EventEmitter";
import Collection from "./Collection";
import Provider from "./Provider";

export default class Container extends EventEmitter implements IContainer {

  public isReady: boolean = false;

  private collection: ICollection;
  private provider: IProvider;

  constructor() {
    super();
    this.collection = new Collection();
    this.provider = new Provider(this.collection);
    this.collection.add("core", Container, () => this);
  }

  public get internalCollection(): ICollection {
    return this.collection;
  }

  public get internalProvider(): IProvider {
    return this.provider;
  }

  public async internalEmit(method: string): Promise<any> {
    return this.emit(method, this.provider);
  }

  public async internalInvoke(method: string): Promise<any> {
    return Promise.all(
      this.collection.internalServices.map((service) => {
        const klass = service.klass;
        if (klass && klass.__service__ === true) {
          switch (method) {
            case "start":
              if (klass.start) {
                return klass.start(this.provider, service.token);
              }
              break;
            case "ready":
              if (klass.ready) {
                return klass.ready(this.provider, service.token);
              }
              break;
            case "mount":
              if (klass.mount) {
                return klass.mount(this.provider, service.token);
              }
              break;
            case "link":
              if (klass.link) {
                return klass.link(this.provider, service.token);
              }
              break;
          }
        }
      })
    );
  }

  // - - -

  public build(builder: (collection: ICollection) => void): IContainer {
    builder(this.collection);
    return this;
  }

  public createContainer(): IContainer {
    const container = new Container();
    container.parent(this);
    return container;
  }

  public createProvider(): IProvider {
    return this.internalProvider.createProvider();
  }

  public async parent(container: IContainer): Promise<any> {
    this.collection.internalSetParent(container.internalCollection);
    this.provider.internalSetParent(container.internalProvider);
    await this.internalInvoke("link");
    await this.emit("link", this.provider);
    await container.internalInvoke("mount");
    return container.internalEmit("mount");
  }

  public async start(): Promise<IProvider> {
    if (this.isReady) { return Promise.resolve(this.provider); }
    await this.internalInvoke("start");
    await this.emit("start", this.provider);
    this.isReady = true;
    await this.internalInvoke("ready");
    await this.emit("ready", this.provider);
    return this.provider;
  }

}
