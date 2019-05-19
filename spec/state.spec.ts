import { State } from '..';
import { hot, cold } from 'jasmine-marbles';

describe('State Tests', () => {
  it('As a USER, I can create a State', () => {
    expect(new State<number>(0)).toEqual(jasmine.any(State));
  });

  it('As a USER, I must set a default valuet to a State', () => {
    const s = new State<number>(0);
    expect(s.obs$).toBeObservable(cold('a', { a: 0 }));
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

});
