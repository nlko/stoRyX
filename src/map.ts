import { State } from './state'
import { Length } from './ifs'
import { Subject } from 'rxjs/src/Subject'
import { Observable } from 'rxjs/src/Observable'
import 'rxjs/src/add/operator/map'
import 'rxjs/src/add/operator/filter'
import 'rxjs/src/add/operator/distinctUntilChanged'

type MapState = any
export type MapData = any
type MapName = string
type MapSetMessage = { name: MapName, data: MapData }
export class Map extends State<MapState> implements Length {

  /** return an Observable of the length */
  get length$(): Observable<number> {
    return this.obs$.map(x => Object.keys(x).length)
  }

  set$ = new Subject<MapSetMessage>()
  delete$ = new Subject<string>()

  constructor(initialValue: MapState = {}) {
    super(initialValue)

    this.set$.map(({ name, data }: MapSetMessage) => (state: MapState) => {
      state[name] = data
      return state
    }).subscribe(this.updater$)

    this.delete$.map((name: MapName) => (state: MapState) => {
      delete state[name]
      return state
    }).subscribe(this.updater$)
  }

  set(name: MapName, data: any) {
    this.set$.next({ name, data })
  }

  getOr$ = (defValue: any, $name: MapName) => this.obs$
    .map(map => map[name] !== undefined ? map[name] : defValue)
    .distinctUntilChanged()

  get$ = (name: MapName) => this.obs$
    .filter(map => map[name] !== undefined)
    .map(map => map[name])
    .distinctUntilChanged()

  isSet$ = (name: MapName) => this.obs$.map(map => map[name] !== undefined).distinctUntilChanged()

  delete(name: MapName) {
    this.delete$.next(name)
  }

  flush() {
    this.updater$.next(_ => ({}))
  }
}
