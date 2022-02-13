import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from '.';
import { MapName } from './map';

/** A set object that may contain element or not indexed using a string.
 *
 * It is possible to retrieve the number of element stored in the map using
 * the [[length$]] attribute.
 *
 * It is possible to subscribe to the change of an element of the Set using the
 * [[isSet$]] method.
 *
 * the [[set]] and [[delete]] methods allows to add remove an element.
 *
 * The obs$ observable allows to detect changes.
 *
 * @param MapData - The Type of data describing a [[Map]].
 */
export class Set extends List<string>{

  constructor(initialValue: string[] = []) {
    super(initialValue)
  }

  /** check if an element exist.
   * @param name - key of the data to check
   * @return an boolean observable indicating whetever the element exists or not.
   */
  isSet$ = (name: MapName): Observable<Boolean> => this.obs$.pipe(
    map(state => state.includes(name))
  );

  toggle(name: MapName): void {
    this.update((state)=>{
      const index = state.indexOf(name);

      if(index>=0) {
        state.splice(index, 1);

        return state;
      } else {
        return [...state, name]
      }
    })
  }
}
