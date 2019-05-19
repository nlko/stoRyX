import * as S from '../index';

describe('Storyx tests', () => {

  beforeEach(() => {
  });

  it('As a DEVELOPER, I should be able to use State', () => {
    expect(new S.State<any>(null)).toEqual(jasmine.any(S.State));
  });

  it('As a DEVELOPER, I should be able to use Map', () => {
    expect(new S.Map()).toEqual(jasmine.any(S.Map));
  });

  it('As a DEVELOPER, I should be able to use Store', () => {
    expect(new S.Store()).toEqual(jasmine.any(S.Store));
  });

  it('As a DEVELOPER, I should be able to use Informer', () => {
    expect(new S.Informer()).toEqual(jasmine.any(S.Informer));
  });
  
  it('As a DEVELOPER, I should be able to use List', () => {
    expect(new S.List()).toEqual(jasmine.any(S.List));
  });
  
  it('As a DEVELOPER, I should be able to use ObjList', () => {
    expect(new S.ObjList()).toEqual(jasmine.any(S.ObjList));
  });
});
