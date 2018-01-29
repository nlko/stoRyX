import { Subject } from 'rxjs/src/Subject'
import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'
import { Observable } from 'rxjs/src/Observable'
import 'rxjs/src/add/operator/scan'

export class State<S> {
  public data$: Observable<S>
  private currentState$: BehaviorSubject<S>

  public updater$: Subject<(s: S) => S>

  constructor(initialValue: S) {
    type UpdateFn = (s: S) => S
    this.updater$ = new Subject<UpdateFn>()
    this.currentState$ = new BehaviorSubject<S>(initialValue)
    this.data$ = this.currentState$.asObservable()
    const dispatcher = (state: S, op: UpdateFn) => op(state)
    this.updater$.scan(dispatcher, initialValue).subscribe(this.currentState$)
  }

  update(fn: (s: S) => S) {
    this.updater$.next((state: S) => fn(state))
  }
}
