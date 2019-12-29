import IProvider from "./interfaces/IProvider";
import IOptions from "./interfaces/IOptions";
import IServiceConstructor from "./interfaces/IServiceConstructor";
import IServiceDescriptor, { Lifetime } from "./interfaces/IServiceDescriptor";

export default class ServiceDescriptor<T> implements IServiceDescriptor<T> {

  public creator?: (provider: IProvider) => T;

  public configurator?: (provider?: IProvider) => IOptions;

  public enabled: boolean = true;

  public klass?: IServiceConstructor;

  public lifetime: Lifetime = Lifetime.SINGLETON;

  public token: string;

  public value?: T;

  constructor(token: string) {
    this.token = token;
  }

  /**
   * Methods
   */

  public create(provider: IProvider): T | null {

    if (!this.enabled) {
      throw new Error("Unable to create disabled service");
    }

    // Check instance
    let instance: T | undefined = this.value;
    if (instance) { return instance; }

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
