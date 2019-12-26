import * as Main from './Main';

describe('Container', () => {

  test('good exports', () => {
    expect(Main.Collection).toBeDefined();
    expect(Main.Container).toBeDefined();
    expect(Main.Provider).toBeDefined();
    expect(Main.ServiceDescriptor).toBeDefined();
    expect(Main.Lifetime).toBeDefined();
  });

});
