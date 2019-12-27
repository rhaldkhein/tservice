import EvenEmitter from './EventEmitter';
import Provider from './Provider';

describe('EventEmitter', () => {

  test('async', async (done) => {

    const em = new EvenEmitter(new Provider());

    const foo = jest.fn();
    const bar = jest.fn();

    em.on('foo', foo);
    em.on('bar', bar);

    await em.emit('foo');
    await em.emit('bar');

    expect(foo).toHaveBeenCalled();
    expect(bar).toHaveBeenCalled();

    done();

  });

});