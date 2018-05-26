import { Map, MapData } from './map'
import { State } from './state'

import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/take'

// type used for updating a data in the store
type StoreUpdate = { name: string, data: StoreData }

// Type of a store state
type StoreState = any

// type of the history
type StoreHistory = StoreState[]

// type of data that can be stored
type StoreData = any

// Store registered values managment
class Subscribers extends Map {
  constructor() {
    super({})
  }

  register$1 = <T extends {}>(name: string, cb: (state: T) => void): Observable<boolean> =>
    this.isSet$(name)
      .take(1) // return the current state
      .map(isSet => !isSet) // what will be done
      .do(whatToDo => {
        if (whatToDo) { // Just do it
          this.set(name, cb)
        }
      })

  unregister = this.delete
}

/** A store class.
 *
 * The store can be used to contain the states of an app.
 *
 * One can add/remove data inside the store using the [[register]]/[[unregister]] method.
 *
 * It is possible to set the value of a data using the [[update]] method or using the [[updater$s]] subject.
 *
 * It is possible to subscribe to a value using the [[select$]] observable.
 *
 * The content of the store can be displayed using the [[dump]]() method and emptied using [[reset]]().
 *
 * The store as an history that support [[rollback]] and can be flushed usinng [[commit]].
 */
export class Store {
  // store state history
  private history: State<StoreHistory> = new State<StoreHistory>([])

  // current state of the store
  private latest$: BehaviorSubject<StoreState> = new BehaviorSubject({})

  /** Subject for updating the content of a data stored
   * Example:
   * ```
   * store.updater$s.next({ name: 'val1', data: 3})
   * ```
   */
  updater$s = new Subject<StoreUpdate>()

  /** Subject for rollbacking the history.
   * See [[rollback]]() for more information regarding the effect of the function.
   * Example:
   * ```
   * store.rollback$s.next()
   * ```
   */
  rollback$s = new Subject<void>()

  /* Subject for flushing the history.
   * See [[flush]]() for more information regarding the effect of the function.
   * Example:
   * ```
   * store.flush$s.next()
   * ```
   */
  flush$s = new Subject<void>()

  /** Subject for compressing the history.
   * See [[commit]]() for more information regarding the effect of the function.
   * Example:
   * ```
   * store.commit$s.next()
   * ```
   */
  commit$s = new Subject<void>()

  // The list of registered data.
  private subscribers = new Subscribers()

  // Dispatch update events when necessary to registered subscribers.
  private storeStateUpdate(names: string[], previousState: StoreState, currentState: StoreState): void {
    // For each backed object
    names
      .map((name: string) => ({ name, prevVal: previousState[name] }))
      .filter(({ name, prevVal }) => currentState[name] !== prevVal)
      .forEach(({ name, prevVal }) => {
        // Inform the subscribers of the state change
        this.subscribers.get$(name)
          .take(1)
          .subscribe((cb: any) => cb(prevVal))
      })

    this.latest$.next(previousState)
  }

  /** Display the content of the store */
  dump(): void {
    this.latest$.take(1).subscribe(
      state => {
        console.log('Current store state')
        console.dir(state)
      })
  }

  /**
   * Example:
   *
   * This example will create ...
   * ```
   * const store = new Store()
   * store.register$1('val1', newVal => { console.log("*" + newVal) }).subscribe()
   * store.select$('val1').subscribe(val => { if (val) console.log(val) })
   * store.update('val1', "Hello,")
   * store.update('val1', "World!")
   * ```
   */
  constructor() {
    this.updater$s.map(
      ({ name, data }: StoreUpdate) =>
        (history: StoreHistory) => {
          const newState =
            history.length ? { ...history[history.length - 1] } : {}

          newState[name] = data

          this.latest$.next(newState)

          return [...history, newState]

        }).subscribe(this.history.updater$s)

    this.rollback$s.map(() => {
      return (history: StoreHistory) => {
        const currentState = history.pop()

        //If there is a current state
        if (currentState) {
          const previousState = history.length ? history[history.length - 1] : {}

          this.storeStateUpdate(Object.keys(currentState), previousState, currentState /*? currentState : {}*/)
        }

        return history
      }
    }).subscribe(this.history.updater$s)

    this.flush$s.map(() => {
      return (history: StoreHistory) => {

        const currentState = history.length ? history[history.length - 1] : undefined

        //If there is a current state
        if (currentState) {
          this.storeStateUpdate(Object.keys(currentState), currentState, {})
        }

        return []
      }
    }).subscribe(this.history.updater$s)

    this.commit$s.map(() => {
      // need to return a function that can return an array that contains
      // the last element of an array (of history)
      return (history: StoreHistory) => {
        return history.splice(-1, 1) // only keep the last element
      }
    }).subscribe(this.history.updater$s) // udpate the history
  }

  /** Register an new value in the store
   * Any [[select$]] to the same name made before the registration will be hooked to this value.
   * It is forbiden to register two values with the same name.
   * @param name - The namee of the value
   * @param cb - Callback that will be called whenever the value changes
   * because of the store (rollback...). The callback parameter is the new value.
   * @return An observable that is true when the value is subscribed
   */
  register$1<T>(name: string, cb: (data: T) => void): Observable<boolean> {
    return this.subscribers.register$1(name, cb)
  }

  /** Unregister a value from the store
   * Unregister value will not trigger any [[select$]] to be closed.
   * @param name - The namee of the value.
   */
  unregister(name: string): void {
    this.subscribers.unregister(name)
  }

  /** Update a registered value in the store
   * @param name - The value to update
   * @param data - The new data to set
   */
  update<T>(name: string, data: T): void {
    this.updater$s.next({ name, data })
  }

  /** subscribe to a registered value in the store
   * @param name - the name of the value to subscribe to
   * @return an observable on the value. (The observable will never terminate)
   * The subscribtion will remains if the value is unregistered from the store:
   * ```
   * const store = new Store()
   * store.select$('val1').subscribe(val => { if (val) console.log(val) })
   * store.register$1('val1', newVal => { console.log("*" + newVal) }).subscribe()
   * store.update('val1', "Hello,")
   * store.unregister('val1')
   * store.register$1('val1', newVal => { console.log("*" + newVal) }).subscribe()
   * store.update('val1', "World!")
   * ```
   * The returned observable only trigger if the stored value changes.
   */
  select$<T>(name: string): Observable<T> {
    return this.latest$
      .map((currentState: any): T => currentState[name])
      .distinctUntilChanged()
  }

  /** Return to the previous state in the history
   * Going back to a previous state will trigger the callback function provided during the
   * registration [[register$1]] of any impacted values.
   */
  rollback(): void {
    this.rollback$s.next()
  }

  /** Remove any data in the store (not the subscription)*/
  flush(): void {
    this.flush$s.next()
  }

  commit(): void {
    this.commit$s.next()
  }

  reset(): void {
    this.subscribers.flush()
    this.flush()
  }
}
