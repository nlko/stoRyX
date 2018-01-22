import { State } from './state'
import { uuidv4 } from './uuidv4'

export class List<T, ID=string> extends State<T[]>{
  constructor(initialContent: T[] = [], protected idField = "_id", private idGenerator = uuidv4) {
    super(initialContent)
  }

  remove(id: string) {
    this.update(state => state.filter(c => c[this.idField] != id))
  }

  add(element: T) {
    if (!element[this.idField]) {
      element[this.idField] = this.idGenerator()
    }

    this.update(state => [...state, element])

    return element[this.idField]
  }

  find(id: string): T {
    return null
  }
}
