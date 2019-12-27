import IProvider from './interfaces/IProvider';

type Handler = (provider: IProvider) => Promise<any> | any;

export default class EventEmitter {

  private events: { [event: string]: Handler[]; } = {};
  public provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  on(event: string, handler: Handler): void {
    let handlers = this.events[event];
    if (!handlers) {
      this.events[event] = handlers = [];
    }
    handlers.push(handler);
  }

  off(event: string, handler: Handler): void {
    let idx, handlers = this.events[event];
    if (handlers) {
      idx = handlers.indexOf(handler);
      if (idx > -1) {
        handlers.splice(idx, 1);
      }
    }
  }

  async emit(event: string): Promise<any> {
    let handlers = this.events[event];
    if (handlers) {
      return Promise.all(
        handlers.map(handler => {
          return handler.call(this, this.provider);
        })
      );
    }
  }

}
