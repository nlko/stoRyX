import { Subject } from 'rxjs/src/Subject'
import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'
import 'rxjs/src/add/operator/scan'

export default class State<S> {
  data$: BehaviorSubject<S>

  public updater$: Subject<(s: S) => S>

  constructor(initialValue: S) {
    type UpdateFn = (s: S) => S
    this.updater$ = new Subject<UpdateFn>()
    this.data$ = new BehaviorSubject<S>(initialValue)
    const dispatcher = (state: S, op: UpdateFn) => op(state)
    this.updater$.scan(dispatcher, initialValue).subscribe(this.data$)
  }

  update(fn: (s: S) => S) {
    this.updater$.next((state: S) => fn(state))
  }
}
