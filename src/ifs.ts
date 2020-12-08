import { Observable } from 'rxjs';

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
  readonly obs$: Observable<T>;

  /** the last value */
  //readonly snapshot: T;
}

/** An interface that enforce the return of lenght
 *
 * This interface specifies the common behavior when it comes to return a length
 */
export interface ILength {
  /** Return an observable of the length */
  readonly length$: Observable<number>;
}

/** Interface for a iterative container
 * @param T - Contained data type.
 */
export interface IContainer<T> {
  /** Retrieve the element value from the list according to its possition in
   * the list.
   * @param position - The position of the element to return
   * @return A hot observable to the element.
   */
  get$(id: number): Observable<T>;

  /** Remove an element using its position in the list
   * @param position - The position index of the element to remove.
   */
  remove(position: number): void;

  /** Add an element at the end of the list
   * @deprecated
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in list.
   * @see add$1
   */
  add$(element: T): Observable<number>;

  /** Add an element at the end of the list
   * @param element - The element to append to the list.
   * @return A cold observable containing the index of the added element in list.
   */
  add$1(element: T): Observable<number>;

  /** Remove the last element of the container.
   * @return A cold observable containing the value of the removed element in
   * the container (observable will return undefined if the container is empty).
   */
  pop$1(): Observable<T>;

  /** Add an element at the start of the container.
   * @param element - The element to prepend to the container.
   * @return nothing.
   */
  unshift$1(element: T): Observable<number>;

  /** Remove an element at the start of the container.
   * @param element - The element to prepend to the container.
   * @return a cold observable on the removed element (observable returns undefined if the container is empty).
   */
  shift$1(): Observable<T>;

}

/** Interface for containers having specific ways for idendifying data
 * @param T - Contained data type.
 * @param ID - Type used to identify a element in the container.
 */
export interface IContainerById<T, ID> extends IContainer<T> {
  /** Remove an element from a container according to its ID
   * @param id - Id of the element to remove.
   */
  removeById(id: ID): void;

  /** Find an element in a container according to its ID
   * @param id - Id of the element to find.
   * @return an observable on the element found.
   */
  findById$(id: ID): Observable<T>;
}
