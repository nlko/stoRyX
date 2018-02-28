import { Holder } from './ifs'
import { AsyncSubject } from 'rxjs/AsyncSubject'
import { Observable } from 'rxjs/Observable'

export class Informer<T> implements Holder<T>{
  private sub$ = new AsyncSubject<T>()
  public inform(val: T): void {
    this.sub$.next(val)
    this.sub$.complete()
  }
  public get obs$(): Observable<T> {
    return this.sub$.asObservable()
  }
}
