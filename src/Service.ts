import IProvider from "./interfaces/IProvider";

export default abstract class Service {

  // Use to verify service
  static __service__: boolean = true;

  // Trigger when the container is linked to new parent
  static link(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when a child container is mounted (this as a parent)
  static mount(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when container is completely ready
  static ready(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when the service it added to container
  static setup(_token: string): void { }

  // Trigger when container is starting
  static start(_provider: IProvider, _token: string): Promise<any> | any { }

}
