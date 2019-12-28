import IProvider from './interfaces/IProvider';
import IOption from './interfaces/IOption';
import IServiceConstructor from './interfaces/IServiceConstructor';
import IServiceDescriptor, { Lifetime } from './interfaces/IServiceDescriptor';

export default class ServiceDescriptor<T> implements IServiceDescriptor<T> {

  creator?: (provider: IProvider) => T;

  configurator?: (provider?: IProvider) => IOption;

  enabled: boolean = true;

  klass?: IServiceConstructor;

  lifetime: Lifetime = Lifetime.SINGLETON;

  token: string;

  value?: T;

  constructor(token: string) {
    this.token = token;
  }

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
      if (this.configurator) {
        instance = new this.klass(provider, this.configurator(provider), this.token);
      } else {
        instance = new this.klass(provider, {}, this.token);
      }
    }

    // Save instance
    if (instance && this.lifetime <= Lifetime.SINGLETON) {
      this.value = instance;
    }

    return instance as T;
  }

}