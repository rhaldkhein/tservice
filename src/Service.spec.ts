/* tslint:disable max-classes-per-file */

import IContainer from "./interfaces/IContainer";
import IProvider from "./interfaces/IProvider";
import Container from "./Container";
import Service from "./Service";
import Provider from "./Provider";

describe("Service", () => {

  describe("Static Event Hooks", () => {

    let container: IContainer;

    beforeEach(() => {
      container = new Container();
    });

    test("setup", () => {
      const funcMock = jest.fn();
      class FooService extends Service {
        public static setup(token: string) {
          expect(token).toBe("foo");
          funcMock();
        }
      }
      container.internalCollection.add("foo", FooService);
      container.createProvider().get("foo");
      expect(funcMock).toBeCalled();
    });

    test("start and ready", async (done) => {
      const funcMockStart = jest.fn();
      const funcMockReady = jest.fn();
      class FooService extends Service {
        public static start(provider: IProvider, token: string) {
          expect(provider).toBeInstanceOf(Provider);
          expect(token).toBe("foo");
          funcMockStart();
        }
        public static ready(provider: IProvider, token: string) {
          expect(provider).toBeInstanceOf(Provider);
          expect(token).toBe("foo");
          funcMockReady();
        }
      }
      container.internalCollection.add("foo", FooService);
      await container.start();
      expect(funcMockStart).toBeCalled();
      expect(funcMockReady).toBeCalled();
      done();
    });

    test("link and mount", async (done) => {
      const funcMockMount = jest.fn();
      const funcMockLink = jest.fn();
      class ParentService extends Service {
        public static mount(provider: IProvider, token: string) {
          expect(provider).toBeInstanceOf(Provider);
          expect(token).toBe("parent");
          funcMockMount();
        }
      }
      class ChildService extends Service {
        public static link(provider: IProvider, token: string) {
          expect(provider).toBeInstanceOf(Provider);
          expect(token).toBe("child");
          funcMockLink();
        }
      }
      const parentContainer = container;
      parentContainer.internalCollection.add("parent", ParentService);
      const childContainer = new Container();
      childContainer.internalCollection.add("child", ChildService);
      await childContainer.parent(parentContainer);
      expect(funcMockLink).toBeCalled();
      expect(funcMockMount).toBeCalled();
      done();
    });

  });

});
