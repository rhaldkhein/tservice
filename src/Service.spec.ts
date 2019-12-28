import IContainer from './interfaces/IContainer';
import Container from './Container';
import Service from './Service';

describe('Service', () => {

  class FooService extends Service {

    static setup() {
      console.log('YAY!');
    }

  }

  let container: IContainer;

  beforeEach(() => {
    container = new Container();
    container.build(services => {
      services.add('foo', FooService);
    });
  });

  test('base', () => {

    const provider = container.createProvider();
    provider.get('foo');

  });

});
