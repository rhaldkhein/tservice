import IContainer from './interfaces/IContainer';
import { ICollection, IProvider, Collection, Provider } from './Main';

export default class Container implements IContainer {

  private collection: ICollection;
  provider: IProvider;
  isReady: boolean = false;

  constructor() {
    this.collection = new Collection();
    this.provider = new Provider(this.collection);
  }

  build(builder: (collection: ICollection) => void) {
    builder(this.collection);
  }

  async start(): Promise<any> {
    if (this.isReady) return Promise.resolve(this.provider);
    await this.invoke('start');
  }

  async invoke(method: string) {
    const services = this.collection.internalServices();
    services.forEach(service => {
      if (!service.klass) return;
      const methodFunction: () => any = service.klass[method];
      // if (method) results.push(method(
      //   this.provider,
      //   this.collection.trimDesc(service)
      // ))
    });
  }

}
