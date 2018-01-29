import { State } from './state'
import { Informer } from './informer'
import { uuidv4 } from './uuidv4'
import { Observable } from 'rxjs/src/Observable'
import 'rxjs/src/add/operator/map'

export class List<T, ID=string> extends State<T[]>{

  get length$(): Observable<number> {
    return this.data$.map(x => x.length)
  }

  constructor(initialContent: T[] = [], protected idField = "_id", private idGenerator = uuidv4) {
    super(initialContent)
  }

  remove(id: string | number): void {
    if (typeof id == 'number')
      this.update(state => { state.splice(id, 1); return state })
    else
      this.update(state => state.filter(c => c[this.idField] != id))
  }

  add(element: T): Observable<number | string> {
    const id = new Informer<number | string>()

    if (typeof element == 'object' && element[this.idField] == undefined) {
      element[this.idField] = this.idGenerator()
    }

    this.update(state => {
      if (typeof element == 'object' && element[this.idField] != undefined) {
        id.inform(element[this.idField])
      } else {
        id.inform(state.length)
      }
      return [...state, element]
    })

    return id.obs$
  }

  find(id: string | number): Observable<T> {
    return this.data$.map((arr: T[]): T => {
      if (typeof id == 'number') return arr[id]
      else return arr.find(c => c[this.idField] == id)
    })
  }
}
