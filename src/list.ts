import { ILength } from './ifs';
import { State } from './state';
import { Informer } from './informer';
import { IContainer } from './ifs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** A generic list of literal.
 *
 * The T type that describe the type of data in the list shall be a literal.
 *
 * The list is indexed using a number like a normal list. If you need a list
 * of object with a specialized function for creating an index in the object,
 * you'd rather use [[ObjList]] instead.
 *
 * The list inherit from the [[State]] object. It can be subscribed to using
 * the obs$ attribute and other method or attribute can be used (like update
 * method).
 *
 * @param T - The literal type of the data contained by the list instance.
 */
export class List<T> extends State<T[]>
  implements ILength, IContainer<T> {

  /** Retrieve the number of element in the list.
   * @return An Observable on the number of elements.
   */
  get length$(): Observable<number> {
    return this.obs$.pipe(map((x: any[]) => x.length));
  }

  /**
   * Example:
   *
   * This example will create a list of object that contains at start one name
   * and to which a second name is append.
   * ```
   * const myList<string>(['Fred'])
   * myList.add('Nicolas')
   * ```
   * @param initialContent - An array with the initial content of the list.
   */
  constructor(initialContent: T[] = []) {
    super(initialContent);
  }

  /** Remove an element using its position in the list.
   * @param position - The position index of the element to remove.
   */
  remove(position: number): void {
    this.update(state => {
      if (position >= 0 && position < state.length)
        state.splice(position, 1);
      return state;
    });
  }

  /** Add an element at the end of the list.
   * @deprecated
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in
   * the list.
   */
  add$(element: T): Observable<number> {
    const id = new Informer<number>();

    this.update(state => {
      id.inform(state.length);
      return [...state, element];
    });

    return id.obs$;
  }

  /** Add an ele
   * @deprecated
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in
   * the list.
   */
  add$1 = this.add$;

  /** @see add$1 */
  push$1 = this.add$1;

  /** Remove the last element of the list.
   * @return A cold observable containing the value of the removed element in
   * the list (observable will return undefined if the list is empty).
   */
  pop$1(): Observable<T> {
    const id = new Informer<T>();

    this.update((list: T[]) => {
      const len = list.length;
      const rest = list.slice(undefined, len - 1);
      const element = list.slice(len - 1, len)[0]; // return undefined if empty
      id.inform(element);
      return rest;
    });

    return id.obs$;
  }

  /** Add an element at the start of the list.
   * @param element - The element to prepend to the list.
   * @return nothing.
   */
  unshift$1(element: T): Observable<number> {
    const id = new Informer<number>();

    this.update(state => {
      id.inform(0);
      return [element, ...state];
    });

    return id.obs$;
  }

  /** Remove an element at the start of the list.
   * @param element - The element to prepend to the list.
   * @return a cold observable on the removed element (observable returns undefined if the list is empty).
   */
  shift$1(): Observable<T> {
    const elem = new Informer<T>();
    this.update(([element, ...rest]) => {
      elem.inform(element);
      return rest;
    });

    return elem.obs$;

  }

  /** Retrieve the element value from the list according to its possition in
   * the list.
   * @param position - The position of the element to return
   * @return A hot observable to the element.
   */
  get$(id: number): Observable<T> {
    return this.obs$.pipe(map((arr: T[]): T => { return arr[id]; }));
  }
}
