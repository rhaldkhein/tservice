import Collection from "./Collection";
import Service from "./ServiceDescriptor";
import { Lifetime } from "./interfaces/IServiceDescriptor";

describe("Collection", () => {

  class FooService { }
  let collection: Collection;

  beforeEach(() => {
    collection = new Collection();
  });

  test("lifetime", () => {
    expect(Lifetime.CONCRETE).toBe(0);
    expect(Lifetime.SCOPED).toBe(2);
    expect(Lifetime.SINGLETON).toBe(1);
    expect(Lifetime.TRANSIENT).toBe(3);
  });

  test("add a service with defaults", () => {
    collection.singleton("foo", FooService);
    const service = collection.internalGet("foo");
    expect(service).toBeInstanceOf(Service);
    expect(service.creator).toBeUndefined();
    expect(service.enabled).toBe(false || true);
    expect(service.lifetime).toBe(Lifetime.SINGLETON);
    expect(service.value).toBeUndefined();
    expect(service.configurator).toBeUndefined();
  });

  test("add a service with custom creator", () => {
    const creator = () => new FooService();
    collection.singleton("foo", FooService, creator);
    const service = collection.internalGet("foo");
    expect(service.creator).toBe(creator);
  });

  test("add a singleton service", () => {
    collection.singleton("foo", FooService);
    const service = collection.internalGet("foo");
    expect(service.lifetime).toBe(Lifetime.SINGLETON);
  });

  test("add a singleton service using alias \"add\"", () => {
    collection.add("foo", FooService);
    const service = collection.internalGet("foo");
    expect(service.lifetime).toBe(Lifetime.SINGLETON);
  });

  test("add a scoped service", () => {
    collection.scoped("foo", FooService);
    const service = collection.internalGet("foo");
    expect(service.lifetime).toBe(Lifetime.SCOPED);
  });

  test("add a transient service", () => {
    collection.transient("foo", FooService);
    const service = collection.internalGet("foo");
    expect(service.lifetime).toBe(Lifetime.TRANSIENT);
  });

  test("add a concrete service", () => {
    const creator = () => ({ foo: "bar" });
    collection.singleton("foo", undefined, creator);
    const service = collection.internalGet("foo");
    expect(service.creator).toBe(creator);
  });

  test("get service from parent collection", () => {
    const parentA = new Collection();
    parentA.singleton("foo", FooService);
    const parentB = new Collection();
    parentB.internalSetParent(parentA);
    let service = collection.internalGet("foo");
    expect(service).toBeUndefined();
    collection.internalSetParent(parentB);
    service = collection.internalGet("foo");
    expect(service).toBeDefined();
    expect(service.lifetime).toBe(Lifetime.SINGLETON);
  });

  test("only get own service", () => {
    const parent = new Collection();
    parent.add("foo", FooService);
    collection.internalSetParent(parent);
    const service = collection.internalGet("foo", true);
    expect(service).toBeUndefined();
  });

});
