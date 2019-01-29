import { ObjList } from './objlist';
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

    s.add$(1);

    expect(s.obs$).toBeObservable(cold('a', { a: [0, 1] }));

  });

  it('As a USER, I can remove a value from a list of object.', () => {
    const defaultValue: T[] = [];

    let i = 100;

    // Create the state
    const s = new ObjList<T>(defaultValue, 'ID', (): string => '' + i++);

    s.add$({ a: 'nico1' });

    expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.add$({ a: 'nico2' }).subscribe(
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

    s.add$({ a: 'nico1' });

    expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }] }));

    s.add$({ a: 'nico2' }).subscribe((id: any) => {
      expect(s.obs$).toBeObservable(cold('a', { a: [{ a: 'nico1', ID: '100' }, { a: 'nico2', ID: '101' }] }));

      expect(s.findById$("101")).toBeObservable(cold('a', { a: { a: 'nico2', ID: '101' } }));
    });
  });
});
