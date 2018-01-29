import { List } from './list'
import { hot, cold } from 'jasmine-marbles';

interface T { a: string }

describe('List Tests', () => {
  it('As a USER, I can create a List', () => {
    expect(new List<number>([-1])).toEqual(jasmine.any(List))
  })

  it('As a USER, I must set a default valuet to a List', () => {
    const s = new List<number>([-1])
    expect(s.data$).toBeObservable(cold('a', { a: [-1] }));
  })

  it('As a USER, I can add a value to the list.', () => {
    const defaultValue = [0]

    // Create the state
    const s = new List<number>(defaultValue)

    s.add(1)

    expect(s.data$).toBeObservable(cold('a', { a: [0, 1] }));

  })

  it('As a USER, I can remove a value from a list of object.', () => {
    const defaultValue: T[] = []

    let i = 100

    // Create the state
    const s = new List<T>(defaultValue, 'ID', (): string => '' + i++)

    s.add({ a: 'nico1' })

    expect(s.data$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.add({ a: 'nico2' }).subscribe(
      id => {

        expect(s.data$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }, { a: 'nico2', ID: id }] }));

        s.remove(id)

        expect(s.data$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

      })

  })

  it('As a USER, I can remove a value from a list of string.', () => {
    const defaultValue = ['hello']

    // Create the state
    const s = new List<string>(defaultValue)

    s.add('nico')

    expect(s.data$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    s.remove(0)

    expect(s.data$).toBeObservable(cold('a', { a: ['nico'] }));
  })

  it('As a USER, I can search an object using its id.', () => {
    const defaultValue: T[] = []

    let i = 100

    // Create the state
    const s = new List<T>(defaultValue, 'ID', (): string => '' + i++)

    s.add({ a: 'nico1' })

    expect(s.data$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.add({ a: 'nico2' }).subscribe(id => {
      expect(s.data$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }, { a: 'nico2', ID: id }] }));

      expect(s.find(id)).toBeObservable(cold('a', { a: { a: 'nico2', ID: '101' } }));
    })
  })

  it('As a USER, I can search a in from a list of string.', () => {
    const defaultValue = ['hello']

    // Create the state
    const s = new List<string>(defaultValue)

    s.add('nico')

    expect(s.data$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    expect(s.find(0)).toBeObservable(cold('a', { a: 'hello' }));
    expect(s.find(1)).toBeObservable(cold('a', { a: 'nico' }));

  })
})
