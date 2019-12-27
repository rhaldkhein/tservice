import Provider from './Provider';
import Container from './Container';

class FooService {
  static run(): string {
    return 'run';
  }
}
class BarService {
  static run(): string {
    return 'run';
  }
  static walk(): string {
    return 'walk';
  }
}
class BazService {
  static walk(): string {
    return 'walk';
  }
}

describe('Container', () => {

  test('instance', () => {
    const container = new Container();
    expect(container.provider).toBeInstanceOf(Provider);
  });

  test('build and resolve', () => {
    const container = new Container();
    container.build((collection) => {
      collection.add('foo', FooService);
    });
    container.build((collection) => {
      collection.add('bar', BarService);
    });
    const foo = container.provider.get<FooService>('foo');
    const bar = container.provider.get<BarService>('bar');
    expect(foo).toBeInstanceOf(FooService);
    expect(bar).toBeInstanceOf(BarService);
  });

  describe('Container Features', () => {

    let container: Container;

    beforeEach(() => {
      container = new Container();
      container.build(collection => {
        collection.add('foo', FooService);
        collection.scoped('bar', BarService);
        collection.transient('baz', BazService);
      });
    });

    test('start method', (done) => {
      container.start().then(provider => {
        expect(provider).toBeInstanceOf(Provider);
        done();
      });
    });

    test('start and ready events', (done) => {
      const start = jest.fn();
      const ready = jest.fn();
      container.on('start', provider => {
        expect(provider).toBeInstanceOf(Provider);
        start();
      });
      container.on('ready', provider => {
        expect(provider).toBeInstanceOf(Provider);
        ready();
      });
      container.start().then(() => {
        expect(start).toHaveBeenCalled();
        expect(ready).toHaveBeenCalled();
        done();
      });
    });

  });

});
