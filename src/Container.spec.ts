import Provider from "./Provider";
import Container from "./Container";

class FooService { }
class BarService { }
class BazService { }

describe("Container", () => {

  test("instance", () => {
    const container = new Container();
    expect(container.internalProvider).toBeInstanceOf(Provider);
  });

  test("build and resolve", () => {
    const container = new Container();
    container.build((collection) => {
      collection.add("foo", FooService);
    });
    container.build((collection) => {
      collection.add("bar", BarService);
    });
    const foo = container.internalProvider.get<FooService>("foo");
    const bar = container.internalProvider.get<BarService>("bar");
    expect(foo).toBeInstanceOf(FooService);
    expect(bar).toBeInstanceOf(BarService);
  });

  describe("Container Features", () => {

    let container: Container;

    beforeEach(() => {
      container = new Container();
      container.build(collection => {
        collection.add("foo", FooService);
        collection.scoped("bar", BarService);
        collection.transient("baz", BazService);
      });
    });

    test("start method", (done) => {
      container.start().then(provider => {
        expect(provider).toBeInstanceOf(Provider);
        done();
      });
    });

    test("start and ready events", (done) => {
      const start = jest.fn();
      const ready = jest.fn();
      container.on("start", provider => {
        expect(provider).toBeInstanceOf(Provider);
        start();
      });
      container.on("ready", provider => {
        expect(provider).toBeInstanceOf(Provider);
        ready();
      });
      container.start().then(() => {
        expect(start).toHaveBeenCalled();
        expect(ready).toHaveBeenCalled();
        done();
      });
    });

    test("parent container", () => {
      const containerA = new Container();
      containerA.build(collection => {
        collection.add("foo", FooService);
      });
      const containerB = new Container();
      containerB.build(collection => {
        collection.add("bar", BarService);
      });
      containerB.parent(containerA);
      const foo = containerB.internalProvider.get<FooService>("foo");
      expect(foo).toBeInstanceOf(FooService);
      const bar = containerA.internalProvider.getOrNull<BarService>("bar");
      expect(bar).toBeNull();
    });

  });

});
