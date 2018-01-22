import { State } from './state'
import { hot, cold } from 'jasmine-marbles';

describe('State Tests', () => {
  it('As a USER, I can create a State', () => {
    expect(new State<number>(0)).toEqual(jasmine.any(State))
  })

  it('As a USER, I must set a default valuet to a State', () => {
    const s = new State<number>(0)
    expect(s.data$).toBeObservable(cold('a', { a: 0 }));
  })

  it('As a USER, I can update the value of a State.', () => {
    const defaultValue = 0
    const updatedValue = defaultValue + 1

    // Create the state
    const s = new State<number>(defaultValue)

    // List of expected value
    const expected = [defaultValue, updatedValue]

    const isUpdate = jasmine.createSpy('Update obserable call');

    // ensure that the first value is the default one
    s.data$.subscribe((val) => {
      isUpdate(val)
      expect(val).toBe(expected.shift());
    });

    // Update the state
    s.update(state => state + 1)

    expect(isUpdate).toHaveBeenCalledTimes(2)
    expect(isUpdate).toHaveBeenCalledWith(updatedValue)
  })

})
