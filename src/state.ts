import { Holder } from "./ifs";
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/scan'

export class State<S> implements Holder<S>{
  private data$: Observable<S>
  private currentState$: BehaviorSubject<S>

  private _updater$: Subject<(s: S) => S>
  public get updater$(): Subject<(s: S) => S> {
    return this._updater$
  }

  constructor(initialValue: S) {
    type UpdateFn = (s: S) => S
    this._updater$ = new Subject<UpdateFn>()
    this.currentState$ = new BehaviorSubject<S>(initialValue)
    this.data$ = this.currentState$.asObservable()
    const dispatcher = (state: S, op: UpdateFn) => op(state)
    this._updater$.scan(dispatcher, initialValue).subscribe(this.currentState$)
  }

  public update(fn: (s: S) => S) {
    this._updater$.next((state: S) => fn(state))
  }

  public get obs$(): Observable<S> {
    return this.data$
  }
}
