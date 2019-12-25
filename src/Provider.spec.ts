import Collection from './Collection'
import Provider, { IProvider } from './Provider'


describe('Provider', () => {

  class Singleton {
    constructor(provider: IProvider) {
      provider.get<BarService>('bar')
    }
  }

  class FooService { }
  class BarService { }
  class BazService { }
  let collection: Collection
  let provider: Provider

  beforeEach(() => {
    provider = new Provider()
    collection = new Collection()
    provider.setCollection(collection)
    collection.add('foo', FooService)
    collection.scoped('bar', BarService)
    collection.transient('baz', BazService)
  })

  test('create intances', () => {
    const foo = provider.get<FooService>('foo')
    expect(foo).toBeInstanceOf(FooService)
    const scopedProvider = new Provider()
    scopedProvider.setParent(provider)
    const bar = scopedProvider.get<BarService>('bar')
    const baz = scopedProvider.get<BazService>('baz')
    expect(bar).toBeInstanceOf(BarService)
    expect(baz).toBeInstanceOf(BazService)
  })

  // test('scoped intances', () => {
  //   const barA = provider.get<BarService>('bar')
  //   const barB = provider.get<BarService>('bar')
  //   expect(barB).toBe(barA)
  //   const newProvider = new Provider()
  //   newProvider.setCollection(collection)
  //   const barC = newProvider.get<BarService>('bar')
  //   expect(barC).not.toBe(barA)
  //   expect(barC).not.toBe(barB)
  // })

  // test('transient intances', () => {
  //   const bazA = provider.get<BazService>('baz')
  //   const bazB = provider.get<BazService>('baz')
  //   expect(bazB).not.toBe(bazA)
  // })

  // test('singleton service should not get scoped or transient service', () => {
  //   collection.singleton('singleton', Singleton)
  //   expect(() => {
  //     provider.get<Singleton>('singleton')
  //   }).toThrow()
  // })

})
