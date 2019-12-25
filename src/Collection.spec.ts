import Collection from './Collection'

interface IFooService { }
class FooService implements IFooService { }

describe('Collection', () => {

  test('create instance', () => {
    const collection = new Collection()
    expect(collection).toBeDefined
  })

  test('add a service', () => {
    const collection = new Collection()
    collection.add('foo', FooService)
    const service = collection.get('foo')
    // service.
    // expect(collection.)
  })

})