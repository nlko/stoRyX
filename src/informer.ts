import { IHolder } from './ifs'
import { AsyncSubject } from 'rxjs/AsyncSubject'
import { Observable } from 'rxjs/Observable'

/** A small class to use when it is needed to return an asyncronous information.
 * (it's just a wrapper around AsyncSubject)
 *
 * ## example:
 *
 * Let say that the following method have to return an observable (because
 * of the interface of the class). But the value returned by the observable
 * isn't known yet. One can use the Informer to complete the observable asyncronously
 * using the `inform` method (setTimeOut is used to emulate this asyncronous
 * behaviors).
 *
 * ```
 * {
 *   const i = new Informer<number>()
 *   setTimeOut(1000,function(){ i.inform(1) })
 *   return i.obs$
 * }
 * ```
 *
 * @param T the object type returned
 */
export class Informer<T> extends AsyncSubject<T> implements IHolder<T> {
  /** Method to call once to set the value when its known.
   * This method will complete the informer object
   * @param val - Value to set.
   */
  public inform(val: T): void {
    this.next(val)
    this.complete()
  }

  /** Method to retrieve the observable to wait on for obtaining the value
   * @return A cold observable on the value.
   */
  public get obs$(): Observable<T> {
    return this.asObservable()
  }
}
