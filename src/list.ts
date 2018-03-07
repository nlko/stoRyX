import { Length } from './ifs'
import { State } from './state'
import { Informer } from './informer'
import { IContainer } from './ifs'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'

/** A generic list of literal.
 *
 * The T type shall be a literal or an object.
 *
 * The list is indexed using a number like a normal list. If you need a list
 * of object with a specialized function for creating an index in the object,
 * you'd rather use @see ObjList
 *
 * The list inherit from the @see State object and can be subscribed to using
 * the obs$ observable.
 *
 * @param T - The literal type of thing contained by the list instance.
 */
export class List<T> extends State<T[]>
  implements Length, IContainer<T>
{

  /** return a Cold Observable of the length */
  get length$(): Observable<number> {
    return this.obs$.map(x => x.length)
  }

  /**
   * Example:
   * --
   * const myList<{name:string}>([{name:'Fred'}])
   * myList.add({name:'Nicolas'})
   * --
   * @param initialContent - An array with the initial content of the list.
   */
  constructor(initialContent: T[] = []) {
    super(initialContent)
  }

  /** Remove an element using its position in the list
   * @param position - The position index of the element to remove.
   */
  remove(position: number): void {
    this.update(state => {
      if (position >= 0 && position < state.length)
        state.splice(position, 1);
      return state
    })
  }

  /** Add an element at the end of the list
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in list.
   */
  add$(element: T): Observable<number> {
    const id = new Informer<number>()

    this.update(state => {
      id.inform(state.length)
      return [...state, element]
    })

    return id.obs$
  }

  /** retrieve the element value from the list according to its possition in
   * the list.
   * @param position - The position of the element to return
   * @return A hot observable to the element.
   */
  get$(id: number): Observable<T> {
    return this.obs$.map((arr: T[]): T => { return arr[id] })
  }
}
