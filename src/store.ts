import { Map, MapData } from './map'
import { State } from './state'

import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/take'


type StoreUpdate = { name: string, data: StoreData }
type StoreState = any
type StoreHistory = StoreState[]
type StoreData = any
type StoreChangeMessage = { name: string, data: StoreData }

type SubscriberFn = (data: StoreData) => void
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
export class Store {
  private history: State<StoreHistory> = new State<StoreHistory>([])
  private latest$: BehaviorSubject<StoreState> = new BehaviorSubject({})

  updater$ = new Subject<StoreUpdate>()
  rollback$ = new Subject<void>()
  updater$s = new Subject<StoreUpdate>()
  commit$ = new Subject<void>()

  rollback$s = new Subject<void>()

  flush$s = new Subject<void>()
  commit$s = new Subject<void>()
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

  dump(): void {
    this.latest$.take(1).subscribe(
      state => {
        console.log('Current store state')
        console.dir(state)
      })
  }

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

  register$1<T>(name: string, cb: (data: T) => void): Observable<boolean> {
    return this.subscribers.register$1(name, cb)
  }

  unregister(name: string): void {
    this.subscribers.unregister(name)
  }

  update<T>(name: string, data: T): void {
    this.updater$s.next({ name, data })
  }

  select$<T>(name: string): Observable<T> {
    return this.latest$
      .map((currentState: any): T => currentState[name])
      .distinctUntilChanged()
  }

  rollback(): void {
    this.rollback$s.next()
  }

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
