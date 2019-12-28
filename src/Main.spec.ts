import * as Main from './Main';

describe('Main', () => {

  test('good exports', () => {
    expect(Main.Collection).toBeDefined();
    expect(Main.Container).toBeDefined();
    expect(Main.Provider).toBeDefined();
    expect(Main.Lifetime).toBeDefined();
    expect(Main.Service).toBeDefined();
  });

});
