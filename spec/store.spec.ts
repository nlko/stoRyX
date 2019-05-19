import { Store } from '..'

describe('Store tests', () => {
  const store = new Store()

  const cbval = (expected: number[]) => (val: any) => {
    expect(val).toBe(expected.shift())
  }

  beforeEach(() => {
    store.reset()
  })

  it('As a USER, I can create a Store', () => {
    expect(store).toEqual(jasmine.any(Store))
  })

  it('As a USER, I can register a value to a Store', () => {

    const cb1 = jasmine.createSpy('optional name 1');
    const cb2 = jasmine.createSpy('optional name 2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    store.register$1('val2', cb2).subscribe(cb21)
    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);
  })


  it("As a USER, I can't register an already registered value to a Store", () => {
    const cb1 = jasmine.createSpy('optional name');

    const cb11 = jasmine.createSpy('Val1 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    const cb12 = jasmine.createSpy('Val1 registration status 2');
    store.register$1('val1', cb1).subscribe(cb12)
    expect(cb12).toHaveBeenCalledTimes(1)
    expect(cb12).toHaveBeenCalledWith(false)

    expect(cb1).toHaveBeenCalledTimes(0);

  })

  it("As a USER, I can unregister a value from a Store", () => {
    const store = new Store()
    const cb1 = jasmine.createSpy('register callback');

    const cb11 = jasmine.createSpy('Val1 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    const cbSelect = jasmine.createSpy('Val1 select');
    store.select$('val1').subscribe(cbSelect)
    expect(cbSelect).toHaveBeenCalledTimes(1)
    expect(cbSelect).toHaveBeenCalledWith(undefined)

    store.unregister('val1')
    expect(cb1).toHaveBeenCalledTimes(0)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cbSelect).toHaveBeenCalledTimes(1)
    expect(cbSelect).toHaveBeenCalledWith(undefined)

    store.register$1('val1', cb1).subscribe(cb11)
    store.update('val1', 0);
    store.update('val1', 1);

    expect(cb1).toHaveBeenCalledTimes(0)

    expect(cb11).toHaveBeenCalledTimes(2)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cbSelect).toHaveBeenCalledTimes(3)
    expect(cbSelect).toHaveBeenCalledWith(1)

  })

  it('As a USER, I can update a value in a Store', () => {
    // const spied = { cb1: cbval(1) }
    // spyOn(spied, 'cb1');
    const cb1 = jasmine.createSpy('optional name');
    // const cb2 = jasmine.createSpy('optional name');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    // const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb1).toHaveBeenCalledTimes(0);
    store.update('val1', 1)
    store.update('val1', 2)
    store.updater$s.next({ name: 'val1', data: 3 })

    expect(cb1).toHaveBeenCalledTimes(0);
    // expect(cb2).toHaveBeenCalledTimes(0);
  })

  it('As a USER, I can rollback a Store', () => {
    const store = new Store()

    const cb1 = jasmine.createSpy('update cb for val1');
    const cb2 = jasmine.createSpy('update cb for val2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    store.register$1('val2', cb2).subscribe(cb21)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

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

    store.rollback$s.next()
    expect(cb1).toHaveBeenCalledTimes(2);
    expect(cb1).toHaveBeenCalledWith(1);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(3);
    expect(cb1).toHaveBeenCalledWith(undefined);
    expect(cb2).toHaveBeenCalledTimes(0);
  })

  it('As a USER, The system broadcast undefined when it rollback to a state where the value is Undefined', () => {
    const store = new Store()
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    store.register$1('val2', cb2).subscribe(cb21)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

    store.update('val1', 1) // [{val1:1}]
    store.update('val1', 2) // [{val1:1},{val1:2}]
    store.update('val2', 0) // [{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) // [{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    expect(cb1).toHaveBeenCalledTimes(0);
    expect(cb2).toHaveBeenCalledTimes(0);

    store.rollback()
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(2);
    expect(cb2).toHaveBeenCalledTimes(0);
    // expect(cb2).toHaveBeenCalledWith(0);


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

  it('As a USER, if I modify the store, an update event is broadcasted to listeners', () => {
    const store = new Store()

    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');
    const cbBroadcast1 = jasmine.createSpy('Select val1');
    const cbBroadcast2 = jasmine.createSpy('Select val2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    store.register$1('val2', cb2).subscribe(cb21)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

    store.select$('val1')
      .subscribe((x: any) => {
        cbBroadcast1(x)
      }, (err: any) => console.log("Error: " + err.message))

    store.select$('val2').subscribe((x: any) => {
      cbBroadcast2(x)
    }, (err: any) => console.log("Error: " + err.message))
    expect(cbBroadcast1).toHaveBeenCalledTimes(1);
    expect(cbBroadcast1).toHaveBeenCalledWith(undefined);
    expect(cbBroadcast2).toHaveBeenCalledTimes(1);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);
    store.update('val1', 1) // [{val1:1}]
    expect(cbBroadcast1).toHaveBeenCalledTimes(2);
    expect(cbBroadcast1).toHaveBeenCalledWith(1);
    expect(cbBroadcast2).toHaveBeenCalledTimes(1);

    store.update('val1', 2) // [{val1:1},{val1:2}]
    expect(cbBroadcast1).toHaveBeenCalledTimes(3);
    expect(cbBroadcast1).toHaveBeenCalledWith(2);
    expect(cbBroadcast2).toHaveBeenCalledTimes(1);

    store.update('val2', 0) // [{val1:1},{val1:2},{val1:2,val2:0}]
    expect(cbBroadcast1).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.update('val1', 3) // [{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]
    expect(cbBroadcast1).toHaveBeenCalledTimes(4);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);

    store.rollback()
    expect(cbBroadcast1).toHaveBeenCalledTimes(5);
    expect(cbBroadcast1).toHaveBeenCalledWith(2);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.rollback()
    expect(cbBroadcast1).toHaveBeenCalledTimes(5);
    expect(cbBroadcast1).toHaveBeenCalledWith(2);
    expect(cbBroadcast2).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cbBroadcast1).toHaveBeenCalledTimes(6);
    expect(cbBroadcast1).toHaveBeenCalledWith(1);
    expect(cbBroadcast2).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cbBroadcast1).toHaveBeenCalledTimes(7);
    expect(cbBroadcast1).toHaveBeenCalledWith(undefined);
    expect(cbBroadcast2).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);

    store.rollback()
    expect(cbBroadcast1).toHaveBeenCalledTimes(7);
    expect(cbBroadcast1).toHaveBeenCalledWith(undefined);
    expect(cbBroadcast2).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);

    expect(cb1).toHaveBeenCalledTimes(3)
    expect(cb2).toHaveBeenCalledTimes(1)
  })

  it('As a USER, I can empty a store', () => {
    const store = new Store()

    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');

    const cbBroadcast1 = jasmine.createSpy('Select val1');
    const cbBroadcast2 = jasmine.createSpy('Select val2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    store.register$1('val1', cb1).subscribe(cb11)
    store.register$1('val2', cb2).subscribe(cb21)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

    store.select$('val1').subscribe((x: any) => {
      cbBroadcast1(x)
    }, (err: any) => console.log("Error: " + err.message))

    store.select$('val2').subscribe((x: any) => {
      cbBroadcast2(x)
    }, (err: any) => console.log("Error: " + err.message))

    expect(cbBroadcast1).toHaveBeenCalledTimes(1);
    expect(cbBroadcast2).toHaveBeenCalledTimes(1);

    store.update('val1', 1) // [{val1:1}]
    store.update('val1', 2) // [{val1:1},{val1:2}]
    store.update('val2', 0) // [{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) // [{val1:1},{val1:2},{val1:2,val2:0},{val1:3,val2:0}]

    expect(cbBroadcast1).toHaveBeenCalledTimes(4);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    expect(cb1).toHaveBeenCalledTimes(0)
    expect(cb2).toHaveBeenCalledTimes(0)

    store.flush()

    expect(cbBroadcast1).toHaveBeenCalledTimes(4);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);

    store.update('val1', 4) // [{val1:4}]
    store.update('val1', 5) // [{val1:4},{val1:5}]
    store.update('val2', 7) // [{val1:4},{val1:5},{val1:5,val2:7}]
    store.update('val1', 6) // [{val1:4},{val1:5},{val1:5,val2:7},{val1:6,val2:7}]

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledTimes(1)

    expect(cbBroadcast1).toHaveBeenCalledTimes(7);
    expect(cbBroadcast1).toHaveBeenCalledWith(6);
    expect(cbBroadcast2).toHaveBeenCalledTimes(4);
    expect(cbBroadcast2).toHaveBeenCalledWith(7);

    store.flush$s.next()

    expect(cbBroadcast1).toHaveBeenCalledTimes(7);
    expect(cbBroadcast2).toHaveBeenCalledTimes(4);
  })

  it('As a USER, I can erase the history', () => {
    const store = new Store()
    const cb1 = jasmine.createSpy('val1');
    const cb2 = jasmine.createSpy('val2');

    const cb11 = jasmine.createSpy('Val1 registration status 1');
    const cb21 = jasmine.createSpy('Val2 registration status 1');

    const cbBroadcast1 = jasmine.createSpy('Select val1');
    const cbBroadcast2 = jasmine.createSpy('Select val2');

    store.register$1('val1', cb1).subscribe(cb11)
    store.register$1('val2', cb2).subscribe(cb21)

    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    expect(cb21).toHaveBeenCalledTimes(1)
    expect(cb21).toHaveBeenCalledWith(true)

    store.select$('val1').subscribe((x: any) => {
      cbBroadcast1(x)
    }, (err: any) => console.log("Error: " + err.message))

    store.select$('val2').subscribe((x: any) => {
      cbBroadcast2(x)
    }, (err: any) => console.log("Error: " + err.message))

    store.update('val1', 1) // [{val1:1}]
    store.update('val1', 2) // [{val1:1},{val1:2}]
    store.update('val2', 0) // [{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) // [{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    expect(cbBroadcast1).toHaveBeenCalledTimes(4);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.commit()

    expect(cbBroadcast1).toHaveBeenCalledTimes(4);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(2);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.rollback()

    expect(cbBroadcast1).toHaveBeenCalledTimes(5);
    expect(cbBroadcast1).toHaveBeenCalledWith(undefined);
    expect(cbBroadcast2).toHaveBeenCalledTimes(3);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);

    store.update('val1', 1) // [{val1:1}]
    store.update('val1', 2) // [{val1:1},{val1:2}]
    store.update('val2', 0) // [{val1:1},{val1:2},{val1:2,val2:0}]
    store.update('val1', 3) // [{val1:1},{val1:2},{val1:2,val2:0},{val1:3}]

    expect(cbBroadcast1).toHaveBeenCalledTimes(8);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(4);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.commit$s.next()

    expect(cbBroadcast1).toHaveBeenCalledTimes(8);
    expect(cbBroadcast1).toHaveBeenCalledWith(3);
    expect(cbBroadcast2).toHaveBeenCalledTimes(4);
    expect(cbBroadcast2).toHaveBeenCalledWith(0);

    store.rollback$s.next()

    expect(cbBroadcast1).toHaveBeenCalledTimes(9);
    expect(cbBroadcast1).toHaveBeenCalledWith(undefined);
    expect(cbBroadcast2).toHaveBeenCalledTimes(5);
    expect(cbBroadcast2).toHaveBeenCalledWith(undefined);
  })
})