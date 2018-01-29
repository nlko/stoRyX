import { State } from './state'
import { Subject } from 'rxjs/src/Subject'
import 'rxjs/src/add/operator/map'
import 'rxjs/src/add/operator/filter'
import 'rxjs/src/add/operator/distinctUntilChanged'

type MapState = any
export type MapData = any
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

  getOr$ = (defValue: any, $name: string) => this.data$
    .map(map => map[name] !== undefined ? map[name] : defValue)
    .distinctUntilChanged()

  get$ = (name: string) => this.data$
    .filter(map => map[name] !== undefined)
    .map(map => map[name])
    .distinctUntilChanged()

  isSet$ = (name: string) => this.data$.map(map => map[name] !== undefined).distinctUntilChanged()

  delete(name: string) {
    this.delete$.next(name)
  }

  flush() {
    this.updater$.next(_ => ({}))
  }
}
