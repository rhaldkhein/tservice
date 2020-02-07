
export type Handler = (provider: any) => Promise<any> | any;

export default interface IEventEmitter {

  on(event: string, handler: Handler): void;
  off(event: string, handler: Handler): void;
  emit<T>(event: string, arg?: T): Promise<any>;

}
