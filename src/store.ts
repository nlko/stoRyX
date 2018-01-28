import { Map, MapData } from './map'
import { State } from './state'

import { Subject } from 'rxjs/src/Subject'
import { Observable } from 'rxjs/src/Observable'
import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'

import 'rxjs/src/add/operator/do'
import 'rxjs/src/add/operator/take'


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

  register = <T extends {}>(name: string, cb: (state: T) => void): Observable<boolean> =>
    this.isSet$(name)
      .take(1) // return the current state
      .map(isSet => !isSet) // what will be done
      .do(whatToDo => {
        if (whatToDo) { // Just do it
          this.set(name, cb)
        }
      })
}

export class Store {
  private history$: State<StoreHistory> = new State<StoreHistory>([])
  private latest$: BehaviorSubject<StoreState> = new BehaviorSubject({})

  updater$ = new Subject<StoreUpdate>()
  rollback$ = new Subject<void>()
  flush$ = new Subject<void>()
  commit$ = new Subject<void>()

  private subscribers$ = new Subscribers()

  private informs(names: string[], previousState: StoreState, currentState: StoreState) {
    //For each backed object
    names
      .map((name: string) => ({ name, prevVal: previousState[name] }))
      .filter(({ name, prevVal }) => currentState[name] !== prevVal)
      .forEach(({ name, prevVal }) => {
        //Inform the subscribers of the state change
        this.subscribers$.get$(name)
          .take(1)
          .subscribe((cb) => cb(prevVal))
      })

    this.latest$.next(previousState)
  }

  dump() {
    this.latest$.take(1).subscribe(
      state => {
        console.log('Current store state')
        console.dir(state)
      })
  }

  constructor() {
    this.updater$.map(
      ({ name, data }: StoreUpdate) =>
        (history: StoreHistory) => {
          const newState =
            history.length ? { ...history[history.length - 1] } : {}

          newState[name] = data

          this.latest$.next(newState)

          return [...history, newState]

        }).subscribe(this.history$.updater$)

    this.rollback$.map(() => {
      return (history: StoreHistory) => {
        const currentState = history.pop()

        //If there is a current state
        if (currentState) {
          const previousState = history.length ? history[history.length - 1] : {}

          this.informs(Object.keys(currentState), previousState, currentState /*? currentState : {}*/)
        }

        return history
      }
    }).subscribe(this.history$.updater$)

    this.flush$.map(() => {
      return (history: StoreHistory) => {

        const currentState = history.pop()

        //If there is a current state
        if (currentState) {
          this.informs(Object.keys(currentState), {}, currentState)
        }

        return []
      }
    }).subscribe(this.history$.updater$)

    this.commit$.map(() => {
      return (history: StoreHistory) => {
        return history.splice(-1, 1)
      }
    }).subscribe(this.history$.updater$)
  }

  register<T>(name: string, cb: (state: T) => void): Observable<boolean> {
    return this.subscribers$.register(name, cb)
  }

  unregister(name: string) {
    this.subscribers$.delete(name)
  }

  update<T>(name: string, data: T) {
    this.updater$.next({ name, data })
  }

  select<T>(selection: string): Observable<T> {
    return this.latest$
      .map((currentState: any): T => currentState[selection])
      .distinctUntilChanged()
  }

  rollback() {
    this.rollback$.next()
  }

  flush() {
    this.flush$.next()
  }

  commit() {
    this.commit$.next()
  }

  reset() {
    this.subscribers$.flush()
    this.flush()
  }
}
