import { Informer } from './informer'
import { hot, cold } from 'jasmine-marbles';

describe('Informer Tests', () => {
  it('As a USER, I can create an Informer', () => {
    expect(new Informer<number>()).toEqual(jasmine.any(Informer))
  })

  it('As a USER, I can set only one value to an informer.', () => {
    const i = new Informer<number>()

    i.inform(0)
    expect(i.obs$).toBeObservable(cold('(a|)', { a: 0 }));
    i.inform(1)
    expect(i.obs$).toBeObservable(cold('(a|)', { a: 0 }));
  })
})
