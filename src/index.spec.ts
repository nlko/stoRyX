import { State, Store } from './index'
import { hot, cold } from 'jasmine-marbles';
import * as Rx from 'rxjs'

describe('TypeScript WebPack Starter Tests', () => {
  it('A good way to start building an awesome lib is by doing Unit Tests 👌🏽', () => {
    expect(true).toBe(true);
  });

  it('State can be created', () => {
    expect(new State<number>(0)).toEqual(jasmine.any(State))
  })

  it('State as a default value', () => {
    const s = new State<number>(0)
    expect(s.data$).toBeObservable(cold('a', { a: 0 }));
  })

  it('State can update its value', () => {
    const s = new State<number>(0)
    const expected = [0, 1]
    s.data$.subscribe((val) => {
      expect(val).toBe(expected.shift());
    });
    s.update(state => state + 1)
    s.data$.subscribe((val) => {
      expect(val).toBe(1);
    });
  })

})

describe('Store tests', () => {
  const store = new Store()

  const cbval = (expected: number) => (val: any) => {
    expect(val).toBe(expected)
  }

  beforeEach(() => {

  })

  it('Store can be created', () => {
    expect(store).toEqual(jasmine.any(Store))
  })

  it('Store can be registered against', () => {
    //const spied = { cb1: cbval(1) }
    //spyOn(spied, 'cb1');
    const cb1 = jasmine.createSpy('optional name');

    expect(store.register('val1', cb1)).toBe(true)
    expect(store.register('val1', cb1)).toBe(false)
    expect(store.register('val1', cb1)).toBe(false)
    //console.log(spied.cb1.callCount)
    expect(cb1).toHaveBeenCalledTimes(0);
    store.update('val1', 1)
    store.update('val1', 2)
    store.update('val1', 3)
    //expect(cb1).toHaveBeenCalledTimes(0);
    store.rollback()
    //expect(cb1).toHaveBeenCalledTimes(1);
    //expect(spied.cb1.calls.count()).toEqual(1);
  })

  //it('Store can be ')


})

const store = new Store()
const cb1 = (i:number)=>console.dir(i)
store.register('val1', cb1)
store.update('val1', 1)
store.rollback()
