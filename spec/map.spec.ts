import { Map } from '..';
import { take } from 'rxjs/operators';
import { hot, cold } from 'jasmine-marbles';

describe('Map tests', () => {
  const map = new Map();

  beforeEach(() => {
    map.flush();
  });

  it('As a USER, it is possible to create a Map', () => {
    expect(map).toEqual(jasmine.any(Map));
  });

  it('As a USER, geting something on an empty Map never returns', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.get$('smth').subscribe(cb1);

    expect(cb1).toHaveBeenCalledTimes(0);
  });

  it('As a USER, geting with a default value on an empty Map never returns the default value', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.getOr$(1, 'smth').subscribe(cb1);
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(1);
    map.getOr$(undefined, 'smth').subscribe(cb1);
    expect(cb1).toHaveBeenCalledTimes(2);
    expect(cb1).toHaveBeenCalledWith(undefined);
    map.set('smth', 2);
    expect(cb1).toHaveBeenCalledTimes(4);
    expect(cb1).toHaveBeenCalledWith(2);
  });

  it('As a USER, trying to test if a value exists (IsSet) on an empty Map resolve to false', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.isSet$('smth').subscribe(cb1);

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(false);
  });

  it('As a USER, it is possible to set a value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');
    const isSet3 = jasmine.createSpy('optional name');

    map.set('smth', 1);
    map.get$('smth').subscribe(isSet1);
    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(1);
  });

  it('As a USER, I can subscribe on isSet$ observable and get updates', () => {
    const cb1 = jasmine.createSpy('spy 1');
    const cb2 = jasmine.createSpy('spy 2');
    const cb3 = jasmine.createSpy('spy 3');

    map.isSet$('smth').pipe(take(1)).subscribe(cb1);
    map.isSet$('smth').subscribe(cb3);
    map.set('smth2', 1);
    map.set('smth', 1);
    map.isSet$('smth').pipe(take(1)).subscribe(cb2);

    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb1).toHaveBeenCalledWith(false);

    expect(cb2).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledWith(true);

    expect(cb3).toHaveBeenCalledTimes(2);
    expect(cb3).toHaveBeenCalledWith(true);
  });


  it('As a USER, it is possible to change a set value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');

    map.set('smth', 1);
    map.get$('smth').subscribe(isSet1);
    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(1);

    map.set$s.next({ name: 'smth', data: 2 });
    map.get$('smth').subscribe(isSet2);
    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(2);
    expect(isSet2).toHaveBeenCalledTimes(1);
    expect(isSet2).toHaveBeenCalledWith(2);
  });

  it('As a USER, registering to a value only trigger when the value effectively change', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');

    map.get$('smth').subscribe(isSet1);

    map.set('smth', 1);

    map.set$s.next({ name: 'smth', data: 2 });

    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(2);

    map.get$('smth').subscribe(isSet2);

    expect(isSet2).toHaveBeenCalledTimes(1);
    expect(isSet2).toHaveBeenCalledWith(2);

    map.set$s.next({ name: 'smth', data: 2 });

    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(2);
    expect(isSet2).toHaveBeenCalledTimes(1);
    expect(isSet2).toHaveBeenCalledWith(2);

  });

  it('As a USER, I can delete a value and receive subscription update', () => {
    const isSet1 = jasmine.createSpy('optional name');
    map.set('smth', 1);

    map.isSet$('smth').subscribe(isSet1);
    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(true);

    map.delete('smth');
    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(false);
  });

  it('As a USER, I continue receive a value if a delete value is recreated', () => {
    const isSet1 = jasmine.createSpy('optional name');
    map.set('smth', 1);

    const vals = [1, 2];

    map.get$('smth').subscribe((val: any) => {
      isSet1(val);
      if (vals.length)
        expect(val).toBe(vals.shift());
    });

    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(1);

    map.delete('smth');

    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(1);

    map.set('smth', 2);

    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(2);
  });

  it('As a User, I can flush (empty) a Map', () => {
    const isSet1 = jasmine.createSpy('optional name');

    map.set('smth', 1);

    map.isSet$('smth').subscribe(isSet1);
    expect(isSet1).toHaveBeenCalledTimes(1);
    expect(isSet1).toHaveBeenCalledWith(true);

    map.flush();

    expect(isSet1).toHaveBeenCalledTimes(2);
    expect(isSet1).toHaveBeenCalledWith(false);
  });

  it('As a USER, I can retrieve the number of element in a map.', () => {
    map.set('smth1', 1);
    map.set('smth2', 2);

    expect(map.length$).toBeObservable(cold('a', { a: 2 }));
  });
});
