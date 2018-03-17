import { IHolder } from "./ifs";
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/scan'

/** Type of the transformation functions that can be used to update a [[State]]
 * object.
 */
export type StateUpdateFn<S> = (s: S) => S
/** A generic container object that can be subscribed to.
 *
 * The content value can be updated using the [[update]] method or the
 * [[updater$s]] subject.
 *
 * It is possible to subscribe to content change event using the [[obs$]]
 * property. On subscription, the last value (or the initial value) is
 * returned.
 *
 * A S parameter allows to define the type of data contained at the creation.
 *
 * It is mandatory to provide an initial value at the creation.
 *
 * @param S - The type of the thing stored into the State object.
 * It can be an a literal, an object, an array,...
 */
export class State<S> implements IHolder<S> {
  /** An observable on the contained data.
   *
   * Example:
   * ```
   * const s = new State<number>(0)
   * s.obs$.filter(v => v%2==0 ).subscribe(stateContent => console.dir(stateContent))
   * ```
   */
  readonly obs$: Observable<S>

  /** Internal current data subject. */
  private currentState$: BehaviorSubject<S>

  /** Internal subject to use for updating the stored content. */
  private _updater$: Subject<StateUpdateFn<S>>

  /** Property to retrieve a subject to be used to update the content.
   *
   * Example:
   *
   * The following add a value to the content of a State that contain a list of
   * number. Subscribers will receive updates. (see [[update]] for an example
   * with more explanations)
   * ```
   * const s = new State<number[]>([1])
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   * const append => newVal => stateContent => [...stateContent, newVal]
   * s.updater$s.next(append(2))
   * ```
   *
   * @return A subject for updating the content.
   */
  public get updater$s(): Subject<StateUpdateFn<S>> {
    return this._updater$
  }

  /**
   * Examples:
   * ```
   * // create an state containing a number with default value 0
   * const s0 = new State<number>(0)
   * // create an state containing an object with its default value
   * const s1 = new State<{ val: number }>({val:1})
   * // create an state containing an array of object with its default value
   * const s2 = new State<{ val: number }[]>([{ val: 1 }, { val: 2 }])
   * ```
   */
  constructor(initialValue: S) {
    this._updater$ = new Subject<StateUpdateFn<S>>()
    this.currentState$ = new BehaviorSubject<S>(initialValue)
    this.obs$ = this.currentState$.asObservable()
    const dispatcher = (state: S, op: StateUpdateFn<S>) => op(state)
    this._updater$.scan(dispatcher, initialValue).subscribe(this.currentState$)
  }

  /** Method to be used to update the content.
   *
   * Example:
   *
   * The following add a value to the content of a State that contain a list of
   * number. Subscribers will receive updates.
   * ```
   * // Create a state with an initial value
   * const s = new State<number[]>([1])
   *
   * // Subscribe to the state
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   *
   * // transformation function that append a value at the end of an array and
   * // return the new array.
   * const append => newVal => stateContent => {return [...stateContent, newVal]}
   *
   * // Append 2 at the end of the array contained in the state s.
   * // (Subscribers, like above will be triggered)
   * s.update(append(2))
   * ```
   *
   * @param fn - A transformation function that takes as argument the current data of the
   * state and return the updated data.
   *
   * @return nothing
   */
  public update(fn: StateUpdateFn<S>): void {
    this._updater$.next((state: S) => fn(state))
  }
}
