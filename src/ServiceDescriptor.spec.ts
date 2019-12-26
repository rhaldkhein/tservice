import Collection from './Collection';
import Provider from './Provider';
import ServiceDescriptor from './ServiceDescriptor';

describe('ServiceDescriptor', () => {

  class FooService { }
  let collection: Collection;
  let provider: Provider;

  beforeEach(() => {
    collection = new Collection();
    provider = new Provider();
  });

  test('correct type', () => {
    collection.add('foo', FooService);
    const service = collection.get<FooService>('foo');
    expect(service).toBeInstanceOf(ServiceDescriptor);
  });

  test('singleton instances', () => {
    collection.add('foo', FooService);
    const service = collection.get<FooService>('foo');
    const intanceA = service.create(provider);
    const intanceB = service.create(provider);
    expect(intanceA).toBeDefined();
    expect(intanceA).toBeInstanceOf(FooService);
    expect(intanceB).toBe(intanceA);
  });

  test('scoped instances', () => {
    collection.scoped('foo', FooService);
    const service = collection.get<FooService>('foo');
    const intanceA = service.create(provider);
    const intanceB = service.create(provider);
    expect(intanceB).not.toBe(intanceA);
  });

  test('transient instances', () => {
    collection.transient('foo', FooService);
    const service = collection.get<FooService>('foo');
    const intanceA = service.create(provider);
    const intanceB = service.create(provider);
    expect(intanceB).not.toBe(intanceA);
  });

});
