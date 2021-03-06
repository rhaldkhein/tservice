/* tslint:disable max-classes-per-file */

import IProvider from "./interfaces/IProvider";
import IOption from "./interfaces/IOptions";
import Collection from "./Collection";
import Provider from "./Provider";

describe("Provider", () => {

  class Singleton {
    constructor(provider: IProvider) {
      provider.get<BarService>("bar");
    }
  }

  class FooService { }
  class BarService { }
  class BazService { }
  let collection: Collection;
  let provider: Provider;

  beforeEach(() => {
    provider = new Provider();
    collection = new Collection();
    provider.internalSetCollection(collection);
    collection.add("foo", FooService);
    collection.scoped("bar", BarService);
    collection.transient("baz", BazService);
  });

  test("create intances", () => {
    const foo = provider.get<FooService>("foo");
    expect(foo).toBeInstanceOf(FooService);
    const newProvider = new Provider();
    newProvider.internalSetParent(provider);
    const bar = newProvider.get<BarService>("bar");
    const baz = newProvider.get<BazService>("baz");
    expect(bar).toBeInstanceOf(BarService);
    expect(baz).toBeInstanceOf(BazService);
  });

  test("scoped intances", () => {
    const oldProvider = new Provider();
    oldProvider.internalSetParent(provider);
    const barA = oldProvider.get<BarService>("bar");
    const barB = oldProvider.get<BarService>("bar");
    expect(barB).toBe(barA);
    const newProvider = new Provider();
    newProvider.internalSetParent(provider);
    const barC = newProvider.get<BarService>("bar");
    expect(barC).not.toBe(barA);
    expect(barC).not.toBe(barB);
  });

  test("transient intances", () => {
    const newProvider = new Provider();
    newProvider.internalSetParent(provider);
    const bazA = newProvider.get<BazService>("baz");
    const bazB = newProvider.get<BazService>("baz");
    expect(bazB).not.toBe(bazA);
  });

  test("singleton service should not get scoped or transient service", () => {
    collection.singleton("singleton", Singleton);
    expect(() => {
      provider.get<Singleton>("singleton");
    }).toThrow();
  });

  test("createProvider method", () => {
    const newProvider = provider.createProvider();
    const bazA = newProvider.get<BazService>("baz");
    const bazB = newProvider.get<BazService>("baz");
    expect(bazB).not.toBe(bazA);
  });

  test("parent chain", () => {
    const providerA = provider.createProvider();
    const providerB = providerA.createProvider();
    const providerC = providerB.createProvider();
    const bar = providerC.get<BarService>("bar");
    expect(bar).toBeDefined();
  });

  test("correct service constructor arguments", () => {
    class Sample {
      constructor(provider: IProvider, option: IOption, token: string) {
        expect(provider).toBeDefined();
        expect(option).toBeDefined();
        expect(token).toBe("sample");
        expect(provider).toBeInstanceOf(Provider);
      }
    }
    collection.add("sample", Sample);
    provider.get<Sample>("sample");
  });

  test("correct option pass to service", () => {
    interface IOwnOption {
      foo: string;
    }
    class Sample {
      constructor(provider: IProvider, option: IOption) {
        const ownOption = option as IOwnOption;
        expect(provider).toBeDefined();
        expect(option).toBeDefined();
        expect(ownOption.foo).toBe("bar");
      }
    }
    collection.add("sample", Sample);
    collection.configure("sample", (provider: IProvider) => {
      expect(provider).toBeInstanceOf(Provider);
      return { foo: "bar" } as IOwnOption;
    });
    provider.get<Sample>("sample");
  });

  test("null missing service", () => {
    const x = provider.get<FooService>("foox");
    const y = provider.getOrNull<FooService>("fooy");
    expect(x).toBeNull();
    expect(y).toBeNull();
  });

  test("throw missing service", () => {
    expect(() => {
      provider.getRequired<FooService>("foox");
    }).toThrowError();
  });

  test("mock", () => {
    const foo = { a: 1 };
    const mock = Provider.mock({
      foo,
      bar() {
        return 1;
      }
    });
    const fooService = mock.get("foo");
    const barService = mock.get("bar");
    expect(fooService).toBe(foo);
    expect(barService).toBe(1);
  });

  test("get all service names", () => {
    const names = provider.getNames();
    expect(names.length).toBe(3);
    expect(names).toContain("foo");
    expect(names).toContain("bar");
    expect(names).toContain("baz");
  });

});
