import { Map } from './map'

describe('Map tests', () => {
  const map = new Map()

  beforeEach(() => {
    map.flush()
  })

  it('As a USER, it is possible to create a Map', () => {
    expect(map).toEqual(jasmine.any(Map))
  })

  it('As a USER, geting something on an empty Map never returns', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.get$('smth').subscribe(cb1)

    expect(cb1).toHaveBeenCalledTimes(0)
  })

  it('As a USER, trying to test if a value exists (IsSet) on an empty Map resolve to false', () => {
    const cb1 = jasmine.createSpy('optional name');

    map.isSet$('smth').subscribe(cb1)

    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb1).toHaveBeenCalledWith(false)
  })

  it('As a USER, it is possible to set a value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');
    const isSet3 = jasmine.createSpy('optional name');

    map.set('smth', 1)
    map.get$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(1)
  })

  it('As a USER, it is possible to change a set value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');

    map.set('smth', 1)
    map.get$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(1)

    map.set$.next({ name: 'smth', data: 2 })
    map.get$('smth').subscribe(isSet2)
    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(2)
    expect(isSet2).toHaveBeenCalledTimes(1)
    expect(isSet2).toHaveBeenCalledWith(2)
  })

  it('As a USER, registering to a value only trigger when the value effectively change', () => {
    const isSet1 = jasmine.createSpy('optional name');
    const isSet2 = jasmine.createSpy('optional name');

    map.get$('smth').subscribe(isSet1)

    map.set('smth', 1)

    map.set$.next({ name: 'smth', data: 2 })

    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(2)

    map.get$('smth').subscribe(isSet2)

    expect(isSet2).toHaveBeenCalledTimes(1)
    expect(isSet2).toHaveBeenCalledWith(2)

    map.set$.next({ name: 'smth', data: 2 })

    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(2)
    expect(isSet2).toHaveBeenCalledTimes(1)
    expect(isSet2).toHaveBeenCalledWith(2)

  })

  it('As a USER, I can delete a value', () => {
    const isSet1 = jasmine.createSpy('optional name');
    map.set('smth', 1)

    map.isSet$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(true)

    map.delete('smth')
    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(false)
  })

  it('As a USER, I continue receive a value if a delete value is recreated', () => {
    const isSet1 = jasmine.createSpy('optional name');
    map.set('smth', 1)

    const vals = [1, 2]

    map.get$('smth').subscribe(val => {
      isSet1(val)
      if (vals.length)
        expect(val).toBe(vals.shift())
    })

    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(1)

    map.delete('smth')

    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(1)

    map.set('smth', 2)

    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(2)
  })

  it('As a User, I can flush (empty) a Map', () => {
    const isSet1 = jasmine.createSpy('optional name');

    map.set('smth', 1)

    map.isSet$('smth').subscribe(isSet1)
    expect(isSet1).toHaveBeenCalledTimes(1)
    expect(isSet1).toHaveBeenCalledWith(true)

    map.flush()

    expect(isSet1).toHaveBeenCalledTimes(2)
    expect(isSet1).toHaveBeenCalledWith(false)
  })
})
