import { State } from './state'
import { ILength } from './ifs'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/distinctUntilChanged'

/** Type of data describing a [[Map]]. */
export type MapState = any
/** Type of data stored in a [[Map]] associated to a key. */
export type MapData = any
/** Type of data for keys that reference data in a [[Map]]. */
export type MapName = string

/** Type of message to use to modify a value in the [[Map]] with the set$s
 * subject attribute.
 * @param name - key of the data to update in the [[Map]];
 * @param data - the new data value.
 */
export type MapSetMessage = { name: MapName, data: MapData }

/** A map object that contained data element indexed using a string.
 *
 * It is possible to retrieve the number of element stored in the map using
 * the [[length]] attribute.
 *
 * It is possible to subscribe to the change of an element of the Map using the
 * [[get$]] and [[getOr$]] methods.
 *
 * The map inherit from the @see State object and can be subscribed to using
 * the obs$ observable (this allows to detect changes).
 */
export class Map extends State<MapState> implements ILength {

  /** return an Observable of the length */
  get length$(): Observable<number> {
    return this.obs$.map(x => Object.keys(x).length)
  }

  /** Subject that can be used to set a new element value by sending a
   * [[MapSetMessage]] into.
   */
  set$s = new Subject<MapSetMessage>()

  /** Subject than can be used to delete an element by sending the key of the
   * element to delete.
   */
  delete$s = new Subject<MapName>()

  /**
   * @param initialValue - The initial value of map
   * Example:
   * ```
   * // construct an empty map
   * const m1 = new Map()
   * // construct a map with some elements inside
   * const m1 = new Map({config:{lang:"fr"}, users:["Nicolas", "Fred"]})
   * ```
   */
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

  /** Set an element value
   * @param name - key of the data to update in the [[Map]];
   * @param data - the new element value.
   */
  set(name: MapName, data: MapData): void {
    this.set$s.next({ name, data })
  }

  /** retrieve an element with default value.
   *
   * This function tries to return the value associated to the name key or
   * otherwise return the default value defValue.
   * @param defValue - the default value to be returned
   * @param name - key of the data to retrieve
   * @return an observable on the data found.
   */
  getOr$ = (defValue: MapData, name: MapName): MapData => this.obs$
    .map(map => map[name] !== undefined ? map[name] : defValue)
    .distinctUntilChanged()

  /** retrieve an element.
   * This function tries to return the value associated to the name key
   * @param name - key of the data to retrieve
   **/
  get$ = (name: MapName): MapData => this.obs$
    .filter(map => map[name] !== undefined)
    .map(map => map[name])
    .distinctUntilChanged()

  /** check if an element exist.
   * @param name - key of the data to check
   * @return an boolean observable indicating whetever the element exists or not.
   */
  isSet$ = (name: MapName): Observable<Boolean> => this.obs$
    .map(map => map[name] !== undefined)
    .distinctUntilChanged()

  /** remove an element from the map.
   * @param name - key of the data todelete
   */
  delete(name: MapName): void {
    this.delete$s.next(name)
  }

  /** remove all element from the map.
   */
  flush(): void {
    this.updater$s.next(_ => ({}))
  }
}
