import EvenEmitter from "./EventEmitter";

describe("EventEmitter", () => {

  test("async", async (done) => {

    const em = new EvenEmitter();

    const foo = jest.fn();
    const bar = jest.fn();

    em.on("foo", foo);
    em.on("bar", bar);

    await em.emit("foo");
    await em.emit("bar");

    expect(foo).toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();

    done();

  });

});
