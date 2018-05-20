import { List } from './list'
import { Informer } from './informer'
import { uuidv4 } from './uuidv4'
import { IContainerById } from './ifs'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/observable/throw'

/** A generic list of anything
 *
 * The T type can be an object or a any literal.
 *
 * The list is indexed using a number like a normal list.
 * In the meantime, it offers a optional index generation for object.
 *
 * The ID type will indicate how the object can be searched for. (only for
 * object ignored for literal)
 *
 *
 * @param T - The type of thing contained
 * @param ID - An optional id type to be use for object idexing (default string)
 */
export class ObjList<T, ID=string> extends List<T>
  implements IContainerById<T, ID>
{
  /**
   * Example:
   * --
   * const myList<{name:string,id:string}>([],"id")
   * myList.add({name:'Nicolas'})
   * --
   * @param initialContent - An array with the initial content of the list.
   * @param idField - The field containing the object identification.
   * @param idGenerator - A function that returns an id of the type compatible with ID.
   */
  constructor(initialContent: T[] = [], protected idField: string = undefined, private idGenerator = uuidv4) {
    super(initialContent)
  }

  /** Remove all the element with a provided id.
   * The element shall be an object, and the list be created with a proper idField
   * @param id - The id of the element to remove.
   */

  removeById(id: ID): void {
    if (typeof (<T>null) === 'object' && this.idField !== undefined)
      this.update(state => state.filter(c => c[this.idField] !== id))
    else {
      throw ('Invalid call to removeById on list of literal object or object without id field')
    }
  }

  add$(element: T): Observable<number> {
    const id = new Informer<number>()

    if (typeof element === 'object' && element[this.idField] === undefined) {
      element[this.idField] = this.idGenerator()
    }

    return super.add$(element)
  }

  findById$(id: ID): Observable<T> {
    if (typeof (<T>null) === 'object' && this.idField !== undefined) {
      return this.obs$.map((arr: T[]): T => {
        return arr.find(c => c[this.idField] === id)
      })
    }
    else {
      return Observable.throw('Invalid call to findById on list of literal object or object without id field')
    }
  }
}
