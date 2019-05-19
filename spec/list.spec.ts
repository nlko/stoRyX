import { List } from '..';
import { hot, cold } from 'jasmine-marbles';
import { Observable, Observer } from 'rxjs';

describe('List Tests', () => {
  it('As a USER, I can create a List', () => {
    expect(new List<number>([-1])).toEqual(jasmine.any(List));
  });

  it('As a USER, I must set a default valuet to a List', () => {
    const s = new List<number>([-1]);
    expect(s.obs$).toBeObservable(cold('a', { a: [-1] }));
  });

  it('As a USER, I can add a value to the list (with push$1).', () => {
    const defaultValue = [0];

    // Create the state
    const s = new List<number>(defaultValue);

    s.push$1(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [0, 1] }));

  });

  it('As a USER, I can add a value to the list (with push$1).', () => {
    const defaultValue = [0];

    // Create the state
    const s = new List<number>(defaultValue);

    s.push$1(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [0, 1] }));

  });

  it('As a USER, I can remove a value with pop$1.', () => {
    const defaultValue = [0, 1];

    // Create the state
    const s = new List<number>(defaultValue);

    const o$ = s.pop$1();

    expect(o$).toBeObservable(cold('(a|)', { a: 1 }));

    expect(s.obs$).toBeObservable(cold('a', { a: [0]}));

  });

  it('As a USER, I can prepend a value to the list (with unshift).', () => {
    const defaultValue = [0];

    // Create the state
    const s = new List<number>(defaultValue);

    s.unshift$1(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [1, 0] }));
  });

  it('As a USER, I can remove a value with pop$1.', () => {
    const defaultValue = [0, 1];

    // Create the state
    const s = new List<number>(defaultValue);

    const o$ = s.pop$1();

    expect(o$).toBeObservable(cold('(a|)', { a: 1 }));

    expect(s.obs$).toBeObservable(cold('a', { a: [0]}));

  });

  it('As a USER, I can remove a value with shift$1.', () => {
    const defaultValue = [0, 1];

    // Create the state
    const s = new List<number>(defaultValue);

    const o$ = s.shift$1();

    expect(o$).toBeObservable(cold('(a|)', { a: 0 }));

    expect(s.obs$).toBeObservable(cold('a', { a: [1]}));
  });

  it("As a USER, I can/'t remove a value with shift$1 or pop$1 from an empty list.", () => {
    const defaultValue: number[] = [];

    // Create the state
    const s = new List<number>(defaultValue);

    const o1$ = s.shift$1();
    const o2$ = s.pop$1();

    expect(o1$).toBeObservable(cold('(a|)', { a: undefined }));
    expect(o2$).toBeObservable(cold('(a|)', { a: undefined }));

    expect(s.obs$).toBeObservable(cold('a', { a: []}));
  });

  it('As a USER, I can remove a value from a list of string.', () => {
    const defaultValue = ['hello', 'nico'];

    // Create the state
    const s = new List<string>(defaultValue);

    expect(s.obs$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    s.remove(0);

    expect(s.obs$).toBeObservable(cold('a', { a: ['nico'] }));
  });

  it('As a USER, I can search a in from a list of string.', () => {
    const defaultValue = ['hello', 'nico'];

    // Create the state
    const s = new List<string>(defaultValue);

    expect(s.obs$).toBeObservable(cold('a', { a: ['hello', 'nico'] }));

    expect(s.get$(0)).toBeObservable(cold('a', { a: 'hello' }));
    expect(s.get$(1)).toBeObservable(cold('a', { a: 'nico' }));

  });

  it('As a USER, I can retrieve the number of element in a list.', () => {
    const defaultValue = ['hello', 'nico'];

    // Create the state
    const s = new List<string>(defaultValue);

    expect(s.length$).toBeObservable(cold('a', { a: 2 }));

  });
});
