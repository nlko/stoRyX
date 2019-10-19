import { State } from '..';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';

describe('State Tests', () => {
  it('As a USER, I can create a State', () => {
    expect(new State<number>(0)).toEqual(jasmine.any(State));
  });

  it('As a USER, I can set a default valuet to a State', () => {
    const s = new State<number>(0);
    expect(s.obs$).toBeObservable(cold('a', { a: 0 }));
  });

  it('As a USER, I can create a state without initial value', () => {
    const s = new State<number>();

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.obs$.subscribe((val: any) => {
      isUpdate(val);
    });

    expect(isUpdate).not.toHaveBeenCalled();
  });

  it('As a USER, I can set the value of an uninitialized State.', () => {
    const defaultValue = 0;
    const updatedValue = defaultValue + 1;

    // Create the state
    const s = new State<number>();

    s.update(0);

    // List of expected value
    const expected = [defaultValue, updatedValue];

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.obs$.subscribe((val: any) => {
      isUpdate(val);
      expect(val).toBe(expected.shift());
    });

    // Update the state
    s.update(state => state + 1);

    expect(isUpdate).toHaveBeenCalledTimes(2);
    expect(isUpdate).toHaveBeenCalledWith(updatedValue);
  });

  it('As a USER, I can update the value of a State 1.', () => {
    const defaultValue = 0;
    const updatedValue = defaultValue + 1;

    // Create the state
    const s = new State<number>(defaultValue);

    // List of expected value
    const expected = [defaultValue, updatedValue];

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.obs$.subscribe((val: any) => {
      isUpdate(val);
      expect(val).toBe(expected.shift());
    });

    // Update the state
    s.update(state => state + 1);

    expect(isUpdate).toHaveBeenCalledTimes(2);
    expect(isUpdate).toHaveBeenCalledWith(updatedValue);
  });

  it('As a USER, I can update the value of a State 2.', () => {
    const defaultValue = 0;
    const updatedValue = defaultValue + 1;

    // Create the state
    const s = new State<number>(defaultValue);

    // List of expected value
    const expected = [defaultValue, updatedValue];

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.obs$.subscribe((val: any) => {
      isUpdate(val);
      expect(val).toBe(expected.shift());
    });

    // Update the state
    s.update(updatedValue);

    expect(isUpdate).toHaveBeenCalledTimes(2);
    expect(isUpdate).toHaveBeenCalledWith(updatedValue);
  });

  it('As a USER, I can update the value of a State 3.', () => {
    const defaultValue = [3, 3];
    const updatedValue = [1, 2, 3];

    // Create the state
    const s = new State<number[]>(defaultValue);

    // List of expected value
    const expected = [defaultValue, updatedValue];

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.obs$.subscribe((val: any) => {
      isUpdate(val);
      expect(val).toBe(expected.shift());
    });

    // Update the state
    s.update(updatedValue);

    expect(isUpdate).toHaveBeenCalledTimes(2);
    expect(isUpdate).toHaveBeenCalledWith(updatedValue);
  });

  it('As a USER, I cannot close the input of the State 1.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1|');
    const source3 = cold('----3#');
    const result = hot('^0123');

    // Create the state under test
    const s = new State<number>();

    source1.subscribe(s.updater$s);
    source2.subscribe(s.updater$s);
    source3.subscribe(s.updater$s);

    expect(s.obs$).toBeObservable(result);
  });

  it('As a USER, I cannot close the input of the State 2.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1--4|');
    const source3 = cold('----3#');
    const result = hot('^0123'); // <- source 2 not received because it will be unsubscribed.

    // Create the state under test
    const s = new State<number>();

    source1.subscribe(s.updater$s);
    const sub = source2.subscribe(s.updater$s);
    source3.subscribe(s.updater$s);

    // Unsubscribe earlier
    getTestScheduler().schedule(() => sub.unsubscribe(), 40);

    // No influence on another subscription
    expect(s.obs$).toBeObservable(result);
  });

  it('As a USER, I cannot close the output of the State 1.', () => {

    const source1 = cold('-0-2|');
    const source2 = cold('--1|');
    const source3 = cold('----3#');
    const result = hot('^0123');

    // Create the state under test
    const s = new State<number>();

    source1.subscribe(s.updater$s);
    source2.subscribe(s.updater$s);
    source3.subscribe(s.updater$s);

    const dummySub = s.obs$.subscribe();

    // Unsubscribe earlier
    getTestScheduler().schedule(() => dummySub.unsubscribe(), 20);

    // No influence on another subscription
    expect(s.obs$).toBeObservable(result);
  });


});
