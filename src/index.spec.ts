import { State, Store, Map } from './index'
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

describe('Map tests', () => {
  const map = new Map()

  beforeEach(() => {
    map.flush()
  })

  it('Map can be created', () => {
    expect(map).toEqual(jasmine.any(Map))
  })

  it('Geting something on an empty map never returns', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.get$('smth').subscribe(cb1)

    expect(cb1).toHaveBeenCalledTimes(0)
  })

  it('IsSet on an empty map never returns false', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.isSet$('smth').subscribe(cb1)

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb1).toHaveBeenCalledWith(false)
  })

  it('Seting a value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');

    map.set('smth', 1)
    map.get$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(1)

    map.set$.next({ name: 'smth', data: 2 })
    map.get$('smth').subscribe(isSet2)
    expect(isSet2).toHaveBeenCalledTimes(1)
    expect(isSet2).toHaveBeenCalledWith(2)

    map.set$.next({ name: 'smth', data: 3 })
    expect(isSet2).toHaveBeenCalledTimes(2)
    expect(isSet2).toHaveBeenCalledWith(3)

    map.set$.next({ name: 'smth', data: 3 })
    expect(isSet2).toHaveBeenCalledTimes(2)
    expect(isSet2).toHaveBeenCalledWith(3)
  })

  it('Setted values can be deleted', () => {
    const isSet1 = jasmine.createSpy('optional name');
    map.set('smth', 1)

    map.isSet$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(true)

    map.delete('smth')
    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(false)
  })

  it('Map content can be flushed', () => {
    const isSet1 = jasmine.createSpy('optional name');

    map.set('smth', 1)

    map.isSet$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(true)

    map.flush()
    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(false)
  })

  //  get$
})

describe('Store tests', () => {
  const store = new Store()

  const cbval = (expected: number[]) => (val: any) => {
    expect(val).toBe(expected.shift())
  }

  beforeEach(() => {
    store.reset()
  })

  it('Store can be created', () => {
    expect(store).toEqual(jasmine.any(Store))
  })

  it('Store can be registered against', () => {
    const cb1 = jasmine.createSpy('optional name');

    const cb11 = jasmine.createSpy('val11');

    store.register('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    const cb12 = jasmine.createSpy('val12');
    store.register('val1', cb1).subscribe(cb12)
    expect(cb12).toHaveBeenCalledTimes(1)
    expect(cb12).toHaveBeenCalledWith(false)

    const cb13 = jasmine.createSpy('val13');
    store.register('val1', cb1).subscribe(cb13)
    expect(cb13).toHaveBeenCalledTimes(1)
    expect(cb13).toHaveBeenCalledWith(false)

    expect(cb1).toHaveBeenCalledTimes(0);

  })
  /*
  it('Store values can be updated', () => {
    //const spied = { cb1: cbval(1) }
    //spyOn(spied, 'cb1');
    const cb1 = jasmine.createSpy('optional name');
    const cb2 = jasmine.createSpy('optional name');

    store.register('val1', cb1)
    store.register('val2', cb2)

    //console.log(spied.cb1.callCount)
    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);
    store.update('val1', 1)
    store.update('val1', 2)
    store.update('val1', 3)

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);
  })

  it('Store state can be rollbacked', () => {
    //const spied = { cb1: cbval(1) }
    //spyOn(spied, 'cb1');
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');

    store.register('val1', cb1)
    store.register('val2', cb2)

    //console.log(spied.cb1.callCount)
    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.update('val1', 1)
    store.update('val1', 2)
    store.update('val1', 3)
    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(1);

    expect(cb1).toHaveBeenCalledWith(2);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(2);
    expect(cb1).toHaveBeenCalledWith(1);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(3);
    expect(cb1).toHaveBeenCalledWith(undefined);
    expect(cb2).toHaveBeenCalledTimes(0);*/
  })
/*
  it('Undefined values and rollback', () => {
    //const spied = { cb1: cbval(1) }
    //spyOn(spied, 'cb1');
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');

    store.register('val1', cb1)
    store.register('val2', cb2)

    //console.log(spied.cb1.callCount)
    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.update('val1', 1) //[{val1:1}]
    store.update('val1', 2) //[{val1:1},{val1:2}]
    store.update('val2', 0) //[{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) //[{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(2);
    expect(cb2).toHaveBeenCalledTimes(0);
    //expect(cb2).toHaveBeenCalledWith(0);


    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(2);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(2);
    expect(cb1).toHaveBeenCalledWith(1);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(3);
    expect(cb1).toHaveBeenCalledWith(undefined);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(undefined);
  })


  it('Modifying the store generate events', () => {
    console.log('start')
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');
    const cb11 = jasmine.createSpy('Select val1');
    const cb21 = jasmine.createSpy('Select val2');

    store.register('val1', cb1)
    store.register('val2', cb2)

    store.select('val1').subscribe(x => {
      console.log('VAL1')
      console.log(x)
      cb11(x)
    }, err => console.log("Error: " + err.message))

    store.select('val2').subscribe(x => {
      console.log('VAL2')
      console.log(x)
      cb21(x)
    }, err => console.log("Error: " + err.message))

    //store.select('val2').subscribe(x => cb21(x))

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.update('val1', 1) //[{val1:1}]
    expect(cb11).toHaveBeenCalledTimes(1);
    expect(cb11).toHaveBeenCalledWith(1);
    expect(cb21).toHaveBeenCalledTimes(0);

    store.update('val1', 2) //[{val1:1},{val1:2}]
    expect(cb11).toHaveBeenCalledTimes(2);
    expect(cb11).toHaveBeenCalledWith(2);
    expect(cb21).toHaveBeenCalledTimes(0);

    store.update('val2', 0) //[{val1:1},{val1:2},{val1:2,val2:0}]
    expect(cb11).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledTimes(1);
    expect(cb21).toHaveBeenCalledWith(0);

    store.update('val1', 3) //[{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]
    expect(cb11).toHaveBeenCalledTimes(3);
    expect(cb11).toHaveBeenCalledWith(3);
    expect(cb21).toHaveBeenCalledTimes(1);

    store.rollback()
    expect(cb11).toHaveBeenCalledTimes(4);
    expect(cb11).toHaveBeenCalledWith(3);
    expect(cb21).toHaveBeenCalledTimes(1);

    store.rollback()
    expect(cb11).toHaveBeenCalledTimes(4);
    expect(cb11).toHaveBeenCalledWith(3);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cb11).toHaveBeenCalledTimes(5);
    expect(cb11).toHaveBeenCalledWith(2);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cb11).toHaveBeenCalledTimes(6);
    expect(cb11).toHaveBeenCalledWith(1);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cb11).toHaveBeenCalledTimes(6);
    expect(cb11).toHaveBeenCalledWith(undefined);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);
  })

  it('Store history can be flushed', () => {
    console.log('start')
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');
    const cb11 = jasmine.createSpy('Select val1');
    const cb21 = jasmine.createSpy('Select val2');

    store.register('val1', cb1)
    store.register('val2', cb2)

    store.select('val1').subscribe(x => {
      console.log('VAL1:' + x)
      cb11(x)
    }, err => console.log("Error: " + err.message))

    store.select('val2').subscribe(x => {
      console.log('VAL2:' + x)
      cb21(x)
    }, err => console.log("Error: " + err.message))

    //store.select('val2').subscribe(x => cb21(x))

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.update('val1', 1) //[{val1:1}]
    store.update('val1', 2) //[{val1:1},{val1:2}]
    store.update('val2', 0) //[{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) //[{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    console.log('FLUSHING')
    store.flush()



    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(undefined);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(undefined);


    expect(cb11).toHaveBeenCalledTimes(4);
    expect(cb11).toHaveBeenCalledWith(undefined);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);
  })

  it('Store history can be merged', () => {
    console.log('start')
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');
    const cb11 = jasmine.createSpy('Select val1');
    const cb21 = jasmine.createSpy('Select val2');

    store.register('val1', cb1)
    store.register('val2', cb2)

    store.select('val1').subscribe(x => {
      console.log('VAL1:' + x)
      cb11(x)
    }, err => console.log("Error: " + err.message))

    store.select('val2').subscribe(x => {
      console.log('VAL2:' + x)
      cb21(x)
    }, err => console.log("Error: " + err.message))

    //store.select('val2').subscribe(x => cb21(x))

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.update('val1', 1) //[{val1:1}]
    store.update('val1', 2) //[{val1:1},{val1:2}]
    store.update('val2', 0) //[{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) //[{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    console.log('MERGE')
    store.commit()

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);


    expect(cb11).toHaveBeenCalledTimes(3);
    expect(cb11).toHaveBeenCalledWith(3);
    expect(cb21).toHaveBeenCalledTimes(1);
    expect(cb21).toHaveBeenCalledWith(0);

    store.rollback()

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(undefined);
    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(undefined);


    expect(cb11).toHaveBeenCalledTimes(4);
    expect(cb11).toHaveBeenCalledWith(undefined);
    expect(cb21).toHaveBeenCalledTimes(2);
    expect(cb21).toHaveBeenCalledWith(undefined);

  })*/
})
