import Store from './store'

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
    const cb1 = jasmine.createSpy('optional name');

    const cb11 = jasmine.createSpy('Val1 registration status 1');

    store.register('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)
/*
    const cb12 = jasmine.createSpy('Val1 registration status 2');
    store.register('val1', cb1).subscribe(cb12)
    expect(cb12).toHaveBeenCalledTimes(1)
    expect(cb12).toHaveBeenCalledWith(false)

    const cb13 = jasmine.createSpy('val13');
    store.register('val1', cb1).subscribe(cb13)
    expect(cb13).toHaveBeenCalledTimes(1)
    expect(cb13).toHaveBeenCalledWith(false)

    expect(cb1).toHaveBeenCalledTimes(0);
*/
  })


  it("As a USER, I can't register an already registered value to a Store", () => {
    const cb1 = jasmine.createSpy('optional name');

    const cb11 = jasmine.createSpy('Val1 registration status 1');

    store.register('val1', cb1).subscribe(cb11)
    expect(cb11).toHaveBeenCalledTimes(1)
    expect(cb11).toHaveBeenCalledWith(true)

    const cb12 = jasmine.createSpy('Val1 registration status 2');
    store.register('val1', cb1).subscribe(cb12)
    expect(cb12).toHaveBeenCalledTimes(1)
    expect(cb12).toHaveBeenCalledWith(false)
/*
    const cb13 = jasmine.createSpy('val13');
    store.register('val1', cb1).subscribe(cb13)
    expect(cb13).toHaveBeenCalledTimes(1)
    expect(cb13).toHaveBeenCalledWith(false)

    expect(cb1).toHaveBeenCalledTimes(0);
*/
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
    expect(cb2).toHaveBeenCalledTimes(0);
  })*/
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
