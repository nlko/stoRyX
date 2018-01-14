import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'
import { ReplaySubject } from 'rxjs/src/ReplaySubject'
import { Subject } from 'rxjs/src/Subject'
import { Observable } from 'rxjs/src/Observable'

import 'rxjs/src/add/operator/scan'
import 'rxjs/src/add/operator/do'
import 'rxjs/src/add/operator/filter'
import 'rxjs/src/add/operator/switchMap'
import 'rxjs/src/add/operator/distinctUntilChanged'
import 'rxjs/src/add/observable/empty'

export class State<S> {
  data$: BehaviorSubject<S>

  //history: S[] = []

  public updater$: Subject<(s: S) => S>

  constructor(initialValue: S) {
    type UpdateFn = (s: S) => S
    this.updater$ = new Subject<UpdateFn>()
    this.data$ = new BehaviorSubject<S>(initialValue)
    const dispatcher = (state: S, op: UpdateFn) => op(state)
    this.updater$.scan(dispatcher, initialValue).subscribe(this.data$)
  }

  update(fn: (s: S) => S) {
    this.updater$.next((state: S) => {
      //this.history.push(state)
      return fn(state)
    })
  }

  // rollback() {
  //   const newState = this.history.pop()
  //   if (newState !== undefined)
  //     this.updater$.next((_: S) => newState)
  // }
  //
  // commit() {
  //   this.history = []
  // }
}

type MapState = any
type MapData = any
type MapSetMessage = { name: string, data: MapData }
export class Map extends State<MapState> {

  set$ = new Subject<MapSetMessage>()
  delete$ = new Subject<string>()

  constructor(initialValue: MapState = {}) {
    super(initialValue)

    this.set$.map(({ name, data }: MapSetMessage) => (state: any) => {
      state[name] = data
      return state
    }).subscribe(this.updater$)

    this.delete$.map((name: string) => (state: any) => {
      delete state[name]
      return state
    }).subscribe(this.updater$)
  }

  set(name: string, data: any) {
    this.set$.next({ name, data })
  }

  get$ = (name: string) => this.data$.do(
    map => console.log('MAP: ' + map)
  )
    .filter(map => map[name] !== undefined)
    .map(map => map[name])
    .do(val => console.log('Value :' + val))
    .distinctUntilChanged()

  isSet$ = (name: string) => this.data$.map(map => map[name] !== undefined).distinctUntilChanged()

  delete(name: string) {
    this.delete$.next(name)
  }

  flush() {
    this.updater$.next(_ => ({}))
  }
}

import 'rxjs/src/add/observable/of'
import 'rxjs/src/add/observable/zip'
import 'rxjs/src/add/operator/map'
import 'rxjs/src/add/operator/take'
import 'rxjs/src/add/operator/withLatestFrom'
import 'rxjs/src/add/operator/share'
import 'rxjs/src/add/operator/toPromise'
import 'rxjs/src/add/operator/switchMap'
import 'rxjs/src/add/operator/first'

type StoreUpdate = { name: string, data: any }
type StoreState = any
type StoreHistory = StoreState[]
type StoreData = any
type StoreChangeMessage = { name: string, data: StoreData }

type SubscriberFn = (data: StoreData) => void
type Subscriber = { name: string, cb: SubscriberFn }
class Subscribers extends Map {
  constructor() {
    super({})
  }
}

export class Store {
  private history$: State<StoreHistory> = new State<StoreHistory>([])
  private changed$: Subject<StoreChangeMessage> = new Subject()

  //private actions$ = new Subject<any>()
  updater$ = new Subject<StoreUpdate>()
  rollback$ = new Subject<void>()
  flush$ = new Subject<void>()
  commit$ = new Subject<void>()
  //register$ = new Subject<{ name: string, cb: (state: any) => void }>()

  subscribers$ = new Subscribers()

  private informs(names: string[], previousState: StoreState, currentState: StoreState) {
    //For each backed object
    names
      .map(name => previousState[name])
      .filter(data => currentState[name] !== data)
      .forEach(data => {
        const update: Observable<SubscriberFn> = this.subscribers$.get$(name).take(1).share()
        //update the
        update.subscribe((cb) => cb(data))
        //Inform the subscribers of the state change
        update.map((cb) => ({ name, data })).subscribe(this.changed$)
      })
  }
  /*
    private informs2(names: string[], previousState: StoreState, currentState: StoreState) {
      //For each backed object
      names.forEach(name => {
        const data = previousState[name]
        // If there is a proper subscription (there should be one)
        // If from there was a change with the previous state

        if ((this.subscribers$[name] !== undefined) && (currentState[name] !== data)) {
          // Inform the subscribers of the state change
          this.subscribers$[name](data)
          this.changed$.next({ name, data })
        }
      })
    }
  */
  constructor() {
    //const dispatcher = (state: StoreHistory, op: (history: StoreHistory) => StoreHistory) => op(state)

    //this.history$.updater$/*.scan(dispatcher, [])*/.subscribe(this.history$.updater$)
    this.subscribers$.get$('val1').subscribe(
      (x) => console.log('found ' + x),
      (x) => console.log('error ' + x),
      () => console.log('complete')
    )
    this.subscribers$.get$('val1').subscribe(
      (x) => console.log('found2 ' + x),
      (x) => console.log('error2 ' + x),
      () => console.log('complete2')
    )

    this.updater$.switchMap(
      ({ name, data }: StoreUpdate) => {
        console.log(name)
        console.log(data)

        this.subscribers$.get$(name).subscribe(
          x => console.log('name found ' + x)
        )

        return Observable.zip(
          Observable.of(name),
          Observable.of(data),
          this.subscribers$.get$(name)
        )
      }).map(([name, data, cb]: [string, StoreData, SubscriberFn]) => {
        console.log(name)
        console.log(data)
        return (history: StoreHistory) => {
          const newState = Object.assign({}, history.length ? history[history.length - 1] : {});

          newState[name] = data

          this.changed$.next({ name, data })

          console.log('Add ' + data)

          return [...history, newState]
        }
      }).subscribe(this.history$.updater$)

    this.rollback$.map(() => {
      console.log('rollback$')
      return (history: StoreHistory) => {

        const currentState = history.pop()
        console.dir(currentState)

        //If there is a current state
        if (currentState) {
          const previousState = history.length ? history[history.length - 1] : {}

          this.informs(Object.keys(currentState), previousState, currentState)
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

  /*private change(name: string) {
    this.history$.updater$.next((history: StoreHistory) => {
      this.changed$.next(name)
      return history
    })
  }*/

  register<T>(name: string, cb: (state: T) => void): Observable<boolean> {
    const sub = new ReplaySubject<boolean>(1)

    this.subscribers$
      .isSet$(name)
      .do(x => console.log(x))
      .take(1)
      .map(isSet => !isSet)
      .do(isSet => {
        sub.next(isSet)
        /*if (isSet) {
          console.log('SETTING ' + name)
          this.subscribers$.set$.next({ name, data: <MapData>cb })
        }*/
      })
      .filter(isSet => isSet)
      .map(_ => ({ name, data: <MapData>cb }))
      .subscribe(this.subscribers$.set$)

    return sub
  }

  unregister(name: string) {
    this.subscribers$.delete(name)
  }

  update<T>(name: string, data: T) {
    this.updater$.next({ name, data })
  }

  select<T>(selection: string): Observable<T> {
    return this.changed$
      .filter(({ name, data }: StoreChangeMessage) => name == selection)
      .map(({ name, data }: StoreChangeMessage) => data)
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
/*
console.log('hello2')
const store = new Store()

store.history$.subscribe(history => {
  console.log('History:')
  console.dir(history)
})

const cb1 = (i: number) => {
  console.log("New val1:" + i)
}

console.log('registering')
store.register('val1', cb1)
console.log('updating')
store.update('val1', 1)
store.update('val1', 2)
console.log('---')
store.update('val1', 3)
console.log('rolling back')
store.rollback()
store.rollback()
store.rollback()
store.rollback()*/
