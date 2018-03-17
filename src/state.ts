import { Holder } from "./ifs";
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/scan'

export type StateUpdateFn<S> = (s: S) => S
export class State<S> implements Holder<S>{
  private data$: Observable<S>
  private currentState$: BehaviorSubject<S>

  private _updater$: Subject<StateUpdateFn<S>>
  public get updater$(): Subject<StateUpdateFn<S>> {
    return this._updater$
  }

  constructor(initialValue: S) {
    this._updater$ = new Subject<StateUpdateFn<S>>()
    this.currentState$ = new BehaviorSubject<S>(initialValue)
    this.data$ = this.currentState$.asObservable()
    const dispatcher = (state: S, op: StateUpdateFn<S>) => op(state)
    this._updater$.scan(dispatcher, initialValue).subscribe(this.currentState$)
  }

  public update(fn: StateUpdateFn<S>): void {
    this._updater$.next((state: S) => fn(state))
  }

  public get obs$(): Observable<S> {
    return this.data$
  }
}
