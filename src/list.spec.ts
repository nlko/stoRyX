import { List } from './list'
import { hot, cold } from 'jasmine-marbles';

describe('List Tests', () => {
  it('As a USER, I can create a List', () => {
    expect(new List<number>([-1])).toEqual(jasmine.any(List))
  })

  it('As a USER, I must set a default valuet to a List', () => {
    const s = new List<number>([-1])
    expect(s.obs$).toBeObservable(cold('a', { a: [-1] }));
  })

  it('As a USER, I can add a value to the list.', () => {
    const defaultValue = [0]

    // Create the state
    const s = new List<number>(defaultValue)

    s.add(1)

    expect(s.obs$).toBeObservable(cold('a', { a: [0, 1] }));

  })

  it('As a USER, I can remove a value from a list of string.', () => {
    const defaultValue = ['hello']

    // Create the state
    const s = new List<string>(defaultValue)

    s.add('nico')

    expect(s.obs$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    s.remove(0)

    expect(s.obs$).toBeObservable(cold('a', { a: ['nico'] }));
  })

  it('As a USER, I can search a in from a list of string.', () => {
    const defaultValue = ['hello']

    // Create the state
    const s = new List<string>(defaultValue)

    s.add('nico')

    expect(s.obs$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    expect(s.find(0)).toBeObservable(cold('a', { a: 'hello' }));
    expect(s.find(1)).toBeObservable(cold('a', { a: 'nico' }));

  })

  it('As a USER, I can retrieve the number of element in a list.', () => {
    const defaultValue = ['hello']

    // Create the state
    const s = new List<string>(defaultValue)

    s.add('nico')

    expect(s.length$).toBeObservable(cold('a', { a: 2 }));

  })
})
