import IProvider from './interfaces/IProvider';
import IServiceDescriptor, { Lifetime } from './interfaces/IServiceDescriptor';

export { IServiceDescriptor };

export default class ServiceDescriptor<T> implements IServiceDescriptor<T> {

  creator: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => boolean;

  enabled: boolean = true;

  klass?: new (p: IProvider) => T;

  lifetime: Lifetime = Lifetime.SINGLETON;

  value?: T;

  create(provider: IProvider): T {

    if (!this.enabled)
      throw new Error('Unable to create disabled service');

    if (this.lifetime <= Lifetime.SINGLETON) {
      if (!this.value) this.value = this.creator(provider);
      return this.value;
    }

    return this.creator(provider);
  }

}