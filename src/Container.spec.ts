import IProvider from './interfaces/IProvider';
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
    let provider: IProvider;

    beforeEach(() => {
      container = new Container();
      provider = container.provider.createProvider();
      container.build(collection => {
        collection.add('foo', FooService);
        collection.scoped('bar', BarService);
        collection.transient('baz', BazService);
      });
    });

    test('start', (done) => {
      container.start().then(done);
    });

    test('start and ready events', (done) => {
      const start = jest.fn();
      const ready = jest.fn();
      class Sample {
        static start = start;
        static ready = ready;
      }
      container.start().then(() => {
        expect(start).toHaveBeenCalled();
        expect(ready).toHaveBeenCalled();
        done();
      });
    });

  });

});
