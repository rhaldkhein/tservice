type Handler = (provider: any) => Promise<any> | any;

export default class EventEmitter {

  private events: { [event: string]: Handler[]; } = {};

  public on(event: string, handler: Handler): void {
    let handlers = this.events[event];
    if (!handlers) {
      this.events[event] = handlers = [];
    }
    handlers.push(handler);
  }

  public off(event: string, handler: Handler): void {
    const handlers = this.events[event];
    if (handlers) {
      const idx = handlers.indexOf(handler);
      if (idx > -1) {
        handlers.splice(idx, 1);
      }
    }
  }

  public async emit<T>(event: string, arg?: T): Promise<any> {
    const handlers = this.events[event];
    if (handlers) {
      return Promise.all(
        handlers.map((handler) => {
          return handler.call(this, arg);
        })
      );
    }
  }

}
