import IProvider from './interfaces/IProvider';
import IServiceDescriptor, { Lifetime } from './interfaces/IServiceDescriptor';

export default class ServiceDescriptor<T> implements IServiceDescriptor<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider: IProvider) => boolean;

  enabled: boolean = true;

  klass?: new (p: IProvider) => T;

  lifetime: Lifetime = Lifetime.SINGLETON;

  value?: T;

  /**
   * Methods
   */

  create(provider: IProvider): T | null {

    if (!this.enabled)
      throw new Error('Unable to create disabled service');

    // Check instance
    let instance: T | undefined = this.value;
    if (instance) return instance;

    // Create instance
    if (this.creator) {
      instance = this.creator(provider);
    } else if (this.klass) {
      instance = new this.klass(provider);
    }

    // Save instance
    if (instance && this.lifetime <= Lifetime.SINGLETON) {
      this.value = instance;
    }

    return instance as T;
  }

}
