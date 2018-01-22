import * as S from './index'

describe('Storyx tests', () => {

  beforeEach(() => {
  })

  it('As a DEVELOPER, I should be able to use State', () => {
    expect(new S.State<any>(null)).toEqual(jasmine.any(S.State))
  })

  it('As a DEVELOPER, I should be able to use Map', () => {
    expect(new S.Map()).toEqual(jasmine.any(S.Map))
  })

  it('As a DEVELOPER, I should be able to use Store', () => {
    expect(new S.Store()).toEqual(jasmine.any(S.Store))
  })
})
