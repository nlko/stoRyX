import { Observable } from 'rxjs/Observable'

/** An interface that enforce object holding.
 *
 * It specifies that any object compliant with the Holder interface have to provide
 * a way to retrieve a value.
 *
 * @param T - The of holded value.
 */
export interface IHolder<T> {
  /** an observable on an object of type T
   */
  readonly obs$: Observable<T>
}

/** An interface that enforce the return of lenght
 *
 * This interface specifies the common behavior when it comes to return a length
 */
export interface ILength {
  /** Return an observable of the length */
  readonly length$: Observable<number>
}

export interface IContainer<T> {
  /** Retrieve the element value from the list according to its possition in
   * the list.
   * @param position - The position of the element to return
   * @return A hot observable to the element.
   */
  get$(id: number): Observable<T>

  /** Remove an element using its position in the list
   * @param position - The position index of the element to remove.
   */
  remove(position: number): void

  /** Add an element at the end of the list
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in list.
   */
  add$(element: T): Observable<number>
}

export interface IContainerById<T, ID> extends IContainer<T> {
  removeById(id: ID): void

  findById$(id: ID): Observable<T>
}
