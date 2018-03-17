import { State } from './state'
import { ILength } from './ifs'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/distinctUntilChanged'

export type MapState = any
export type MapData = any
export type MapName = string
export type MapSetMessage = { name: MapName, data: MapData }
export class Map extends State<MapState> implements ILength {

  /** return an Observable of the length */
  get length$(): Observable<number> {
    return this.obs$.map(x => Object.keys(x).length)
  }

  set$s = new Subject<MapSetMessage>()
  delete$s = new Subject<string>()

  constructor(initialValue: MapState = {}) {
    super(initialValue)

    this.set$s.map(({ name, data }: MapSetMessage) => (state: MapState) => {
      state[name] = data
      return state
    }).subscribe(this.updater$s)

    this.delete$s.map((name: MapName) => (state: MapState) => {
      delete state[name]
      return state
    }).subscribe(this.updater$s)
  }

  set(name: MapName, data: any): void {
    this.set$s.next({ name, data })
  }

  getOr$ = (defValue: any, name: MapName): MapData => this.obs$
    .map(map => map[name] !== undefined ? map[name] : defValue)
    .distinctUntilChanged()

  get$ = (name: MapName): MapData => this.obs$
    .filter(map => map[name] !== undefined)
    .map(map => map[name])
    .distinctUntilChanged()

  isSet$ = (name: MapName): Observable<Boolean> => this.obs$.map(map => map[name] !== undefined).distinctUntilChanged()

  delete(name: MapName): void {
    this.delete$s.next(name)
  }

  flush(): void {
    this.updater$s.next(_ => ({}))
  }
}
