import { Observable } from 'rxjs/Observable'

export interface Holder<T> {
  readonly obs$: Observable<T>
}

export interface Length {
  readonly length$: Observable<number>
}
