import { ObjList } from '..';
import { hot, cold } from 'jasmine-marbles';

interface T { a: string; }

describe('ObjList Tests', () => {
  it('As a USER, I can create a ObjList', () => {
    expect(new ObjList<number>([-1])).toEqual(jasmine.any(ObjList));
  });

  it('As a USER, I must set a default valuet to a ObjList', () => {
    const s = new ObjList<number>([-1]);
    expect(s.obs$).toBeObservable(cold('a', { a: [-1] }));
  });

  it('As a USER, I can add a value to the list.', () => {
    const defaultValue = [0];

    // Create the state
    const s = new ObjList<number>(defaultValue);

    s.push$1(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [0, 1] }));

  });

  it('As a USER, I can pop a value from the list.', () => {
    const defaultValue = [0, 1];

    // Create the state
    const s = new ObjList<number>(defaultValue);

    const o$ = s.pop$1();

    expect(o$).toBeObservable(cold('(a|)', { a: 1 }));

    expect(s.obs$).toBeObservable(cold('a', { a: [0]}));

  });


  it('As a USER, I can prepend a value to the list (with unshift).', () => {
    const defaultValue = [0];

    // Create the state
    const s = new ObjList<number>(defaultValue);

    s.unshift$1(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [1, 0] }));
  });

  it('As a USER, I can remove a value with shift$1.', () => {
    const defaultValue = [0, 1];

    // Create the state
    const s = new ObjList<number>(defaultValue);

    const o$ = s.shift$1();

    expect(o$).toBeObservable(cold('(a|)', { a: 0 }));

    expect(s.obs$).toBeObservable(cold('a', { a: [1]}));
  });

  it("As a USER, I can/'t remove a value with shift$1 or pop$1 from an empty list.", () => {
    const defaultValue: number[] = [];

    // Create the state
    const s = new ObjList<number>(defaultValue);

    const o1$ = s.shift$1();
    const o2$ = s.pop$1();

    expect(o1$).toBeObservable(cold('(a|)', { a: undefined }));
    expect(o2$).toBeObservable(cold('(a|)', { a: undefined }));

    expect(s.obs$).toBeObservable(cold('a', { a: []}));
  });

  it('As a USER, I can remove a value from a list of object.', () => {
    const defaultValue: T[] = [];

    let i = 100;

    // Create the state
    const s = new ObjList<T>(defaultValue, 'ID', (): string => '' + i++);

    s.push$1({ a: 'nico1' });

    expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.push$1({ a: 'nico2' }).subscribe(
      (id: number) => {
        expect(id).toBe(1);
        expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }, { a: 'nico2', ID: '101' }] }));

        s.remove(id);

        expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

      });

  });

  it('As a USER, I can search an object using its id.', () => {
    const defaultValue: T[] = [];

    let i = 100;

    // Create the state
    const s = new ObjList<T>(defaultValue, 'ID', (): string => '' + i++);

    s.push$1({ a: 'nico1' });

    expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.push$1({ a: 'nico2' }).subscribe((id: any) => {
      expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }, { a: 'nico2', ID: '101' }] }));

      expect(s.findById$("101")).toBeObservable(cold('a', { a: { a: 'nico2', ID: '101' } }));
    });
  });

  it('As a USER, I can retrieve the number of element in a list.', () => {
    const defaultValue = ['hello', 'nico'];

    // Create the state
    const s = new ObjList<string>(defaultValue);

    expect(s.length$).toBeObservable(cold('a', { a: 2 }));

  });
});
