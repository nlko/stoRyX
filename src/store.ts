import { Map, MapData } from './map'
import State from './state'

import { Subject } from 'rxjs/src/Subject'
import { Observable } from 'rxjs/src/Observable'
import { ReplaySubject } from 'rxjs/src/ReplaySubject'

import 'rxjs/src/add/observable/of'
import 'rxjs/src/add/observable/zip'
import 'rxjs/src/add/observable/defer'
import 'rxjs/src/add/operator/take'
import 'rxjs/src/add/operator/switchMap'
import 'rxjs/src/add/operator/share'
import 'rxjs/src/add/operator/publish'
import "rxjs/src/add/operator/multicast";

type StoreUpdate = { name: string, data: StoreData }
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

  register = <T extends {}>(name: string, cb: (state: T) => void): Observable<boolean> =>
    this.isSet$(name)
      .take(1) // return the current state
      .map(isSet => !isSet) // what will be done
      .do(whatToDo => {
        //console.log(whatToDo)
        if (whatToDo) { // Just do it
          //console.log('Registering ' + name)
          this.set(name, cb)
        }
      })
}

export default class Store {
  private history$: State<StoreHistory> = new State<StoreHistory>([])
  private changed$: Subject<StoreChangeMessage> = new Subject()

  //private actions$ = new Subject<any>()
  updater$ = new Subject<StoreUpdate>()
  rollback$ = new Subject<void>()
  flush$ = new Subject<void>()
  commit$ = new Subject<void>()
  //register$ = new Subject<{ name: string, cb: (state: any) => void }>()

  private subscribers$ = new Subscribers()

  private informs(names: string[], previousState: StoreState, currentState: StoreState) {
    /*console.log('informs')
    console.log(names)
    console.log(previousState['val1'])
    console.log(currentState['val1'])*/
    //For each backed object
    names
      .map((name: string) => ({ name, prevVal: previousState[name] }))
      // .map((x) => {
      //   console.log(x.prevVal)
      //   return x
      // })
      .filter(({ name, prevVal }) => {
        // console.log(currentState[name])
        // console.log(prevVal)
        // console.log(currentState[name] !== prevVal)
        return currentState[name] !== prevVal
      })
      // .map((x: any) => {
      //   console.log(x)
      //   return x
      // })
      .forEach(({ name, prevVal }) => {
        //        console.log("currentState: " + curentState)
        // console.log("name: " + name)
        // console.log("prevVal: " + prevVal)
        //this.subscribers$.data$.take(1).subscribe(data => Object.keys((key: string) => console.log("Name: " + key + " = " + data[key])))

        //Inform the subscribers of the state change
        this.subscribers$.get$(name)
          // .do(x => console.log("get = " + x))
          .take(1)
          .subscribe((cb) => cb(prevVal))

        this.changed$.next({ name, data: prevVal })
        //update.map((cb) => ({ name, data })).subscribe(this.changed$)
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
          //this.changed$.next({ name, data })
        }
      })
    }
  */

  constructor() {

    //const dispatcher = (state: StoreHistory, op: (history: StoreHistory) => StoreHistory) => op(state)

    //this.history$.updater$/*.scan(dispatcher, [])*/.subscribe(this.history$.updater$)
    /*    this.subscribers$.get$('val1').subscribe(
          (x) => console.log('$ ' + x),
          (x) => console.log('error ' + x),
          () => console.log('complete')
        )
        this.subscribers$.get$('val1').subscribe(
          (x) => console.log('found2 ' + x),
          (x) => console.log('error2 ' + x),
          () => console.log('complete2')
        )
    */
    this.updater$.map(
      ({ name, data }: StoreUpdate) => {
        // console.log('upate')
        // console.log(name)
        // console.log(data)
        return (history: StoreHistory) => {
          const newState =
            history.length ? { ...history[history.length - 1] } : {}

          newState[name] = data

          // console.log("newState " + { name, data })

          this.changed$.next({ name, data })

          // console.log('Add ' + data)

          return [...history, newState]
        }
      }).subscribe(this.history$.updater$)

    this.rollback$.map(() => {
      // console.log('rollback$')
      return (history: StoreHistory) => {
        // console.log('rollback')
        const currentState = history.pop()
        // console.log(history)
        // console.log(currentState)

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

  /*private change(name: string) {
    this.history$.updater$.next((history: StoreHistory) => {
      this.changed$.next(name)
      return history
    })
  }*/


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
