import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'
import { Subject } from 'rxjs/src/Subject'

import 'rxjs/src/add/operator/scan'

export class State<S> {
  data$: BehaviorSubject<S>

  history: S[] = []

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
      this.history.push(state)
      return fn(state)
    })
  }

  rollback() {
    const newState = this.history.pop()
    if (newState !== undefined)
      this.updater$.next((_: S) => newState)
  }

  commit() {
    this.history = []
  }
}

import 'rxjs/src/add/operator/map'

type StoreUpdate = { name: string, data: any }

export class Store {
  private history$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])

  private actions$ = new Subject<any>()
  updater$ = new Subject<StoreUpdate>()
  rollback$ = new Subject<number>()
  flush$ = new Subject<void>()
  //register$ = new Subject<{ name: string, cb: (state: any) => void }>()

  subscribers = {}

  constructor() {
    const dispatcher = (state: any, op: any) => {
      console.log('dispatcher called')
      return op(state)
    }
    this.actions$.scan(dispatcher, []).subscribe(this.history$)
    this.updater$.map(({ name, data }: StoreUpdate) => {
      console.log(data as number)
      return (history: any[]) => {
        console.log('updating')
        console.dir(history)
        if (this.subscribers[name] === undefined) return history
        const latest = history.length ? history[history.length] : {}
        console.dir(history)
        latest[name] = data
        return [...history, latest]
      }
    }).subscribe(this.actions$)

    this.rollback$.map((i) => {
      console.log(i)
      return (history: any[]) => {
        console.log('rollback')

        const states = history.pop()
        console.dir(states)
        if (states) {
          Object.keys(states).forEach(
            key => {
              console.log(key)
              if (states[key] !== undefined && this.subscribers[key] !== undefined) {
                console.log('calling')
                this.subscribers[key](states[key])
              }
            })
        }

        return history
      }
    }).subscribe(this.actions$)

    this.flush$.map(() => {
      return (history: any[]) => []
    }).subscribe(this.actions$)
  }

  register(name: string, cb: (state: any) => void): boolean {
    if (this.subscribers[name] === undefined) {
      this.subscribers[name] = cb
      return true
    } else {
      return false
    }
  }

  update(name: string, data: any) {
    this.updater$.next({ name, data })
  }

  rollback() {
    this.rollback$.next(4)
  }

  flush() {
    this.flush$.next()
  }
}


const store = new Store()
const cb1 = (i:number)=>console.dir(i)
store.register('val1', cb1)
store.update('val1', 1)
store.rollback()
