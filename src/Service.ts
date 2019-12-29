/* tslint:disable variable-name no-empty */

import IProvider from "./interfaces/IProvider";

export default abstract class Service {

  // Use to verify service
  public static __service__: boolean = true;

  // Trigger when the container is linked to new parent
  public static link(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when a child container is mounted (this as a parent)
  public static mount(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when container is completely ready
  public static ready(_provider: IProvider, _token: string): Promise<any> | any { }

  // Trigger when the service it added to container
  public static setup(_token: string): void { }

  // Trigger when container is starting
  public static start(_provider: IProvider, _token: string): Promise<any> | any { }

}
