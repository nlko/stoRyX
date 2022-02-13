import { BehaviorSubject, Observable, of, PartialObserver, ReplaySubject, Subject } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import { IHolder } from "./ifs";

/** Type of the transformation functions that can be used to update a [[State]]
 * object.
 */
export type StateUpdateFn<S> = (s: S) => S;
/** A generic container object that can be subscribed to.
 *
 * The content value can be updated using the [[update]] method or the
 * [[updater$s]] subject.
 *
 * It is possible to subscribe to content change event using the [[obs$]]
 * property. Upon subscription, the last value (or the initial value) is
 * returned.
 *
 * A S parameter allows to define the type of data contained.
 *
 * It is not mandatory to provide an initial value directly at the creation. In that
 * case a subsriber may receive the first value with a delay (depending on when one
 * will use the [[update]] method to set a value).
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
  readonly obs$: Observable<S>;

  /** Internal current data subject. */
  private currentState$s: ReplaySubject<S>;
  private stateInitialized$s = new BehaviorSubject(false);

  /** Internal subject to use for updating the stored content.
   * @deprecated
   */
  private _updater$: Subject<StateUpdateFn<S>|S>;

  /** Property to retrieve a subject to be used to update the content.
   *
   * Examples:
   *
   * The following add a value to the content of a State that contain a list of
   * number. Subscribers will receive updates. (see [[update]] for an example
   * with more explanations)
   * ```
   * const s = new State<number[]>([1])
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   * const append => newVal => stateContent => [...stateContent, newVal]
   * s.updater$s.next(append(2)); // see below the update syntax shortcut.
   * ```
   * It is also possible to directly set the state instead of passing a function updating the state
   * ```
   * const s = new State<number[]>([1])
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   * s.updater$s.next([3,4,5])
   * ```
   * In some case it is not required have any initial value
   * ```
   * const s = new State<number>() // no initial value
   * s.obs$.subscribe(stateContent => console.dir(stateContent)) // triggered with a 1 second delay
   * setTimeout(() => s.update(1), 1000) // delay the update
   * ```
   *
   * @return A subject for updating the content.
   *
   * Remark: The returned observer is partial and will ignore `error` and `complete` messages.
   */
  public get updater$s(): PartialObserver<StateUpdateFn<S>|S> {
    return {
      next: (val: StateUpdateFn<S>|S) => this.update(val),
      error: () => {}
    };
  }

  /**
   * Examples:
   * ```
   * // create a state containing a number but with no initial value
   * const s0 = new State<number>()
   * // create a state containing a number with default value 0
   * const s1 = new State<number>(0)
   * // create a state containing an object with its default value
   * const s2 = new State<{ val: number }>({val:1})
   * // create a state containing an array of object with its default value
   * const s3 = new State<{ val: number }[]>([{ val: 1 }, { val: 2 }])
   * ```
   */
  constructor(initialValue: S = undefined) {
    this._updater$ = new Subject<StateUpdateFn<S>|S>();
    this.currentState$s = new ReplaySubject<S>(1);
    this.obs$ = this.currentState$s.asObservable();
    if(initialValue) {
      this.currentState$s.next(initialValue);
      this.stateInitialized$s.next(true);
    }
    const dispatcher = (state: S, op: StateUpdateFn<S>|S) =>
      typeof op === 'function' ? (op as StateUpdateFn<S>)(state) : (op as S);
    // TBD is there a memory leak
    this._updater$.pipe(
      tap(()=>{}, ()=>{}, ()=>{console.dir('done')}),
      scan(dispatcher, initialValue)).subscribe(this.currentState$s);
    /*if (initialValue !== undefined) {
      this.update(initialValue);
    }*/
  }

  /** Method to be used to update the content.
   *
   * Example 1:
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
   * Example 2:
   *
   * The following set the content of a State that contain a list of
   * number. Subscribers will receive updates.
   * ```
   * // Create a state with an initial value
   * const s = new State<number[]>([1])
   *
   * // Subscribe to the state
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   *
   * // Set the new array contained in the state s.
   * // (Subscribers, like above will be triggered)
   * s.update([3,4])
   * ```
   *
   * Example 3:
   *
   * The following exemple create a state without initial value.
   * Later the content is set and latter it is updated
   *
   * ```
   * // Create a state with an initial value
   *
   * const s = new State<number[]>()
   *
   * // Subscribe to the state
   * s.obs$.subscribe(stateContent => console.dir(stateContent))
   *
   * // transformation function that append a value at the end of an array and
   * // return the new array.
   * const append => newVal => stateContent => [...stateContent, newVal]
   *
   * // Set an initial value
   * // Set the new array contained in the state s.
   * // (Subscribers, like above will be triggered)
   * s.update([1])
   *
   * // Update the content by adding a value to the list
   * // Set the new array contained in the state s.
   * // (Subscribers, like above will be triggered)
   * s.update(append(2));
   * ```
   *
   * @param fn - A transformation function that takes as argument the current data of the
   * state and return the updated data.
   *
   * @return nothing
   */
  public update(fn: StateUpdateFn<S>|S): void {
    //this._updater$.next(fn as StateUpdateFn<S>);

    const dispatcher = (state: S, op: StateUpdateFn<S>|S) =>
      typeof op === 'function' ? (op as StateUpdateFn<S>)(state) : (op as S);

    this.stateInitialized$s.pipe(
      switchMap(isInitialized => {
        if(isInitialized) {
          return this.obs$
        } else {
          return of(undefined) as Observable<S>
        }
      }),
      first(),
    ).subscribe((state) => {
      this.currentState$s.next(dispatcher(state as unknown as S, fn))
      this.stateInitialized$s.next(true);
    })
  }
}
