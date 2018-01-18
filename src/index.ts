import { BehaviorSubject } from 'rxjs/src/BehaviorSubject'
import { ReplaySubject } from 'rxjs/src/ReplaySubject'
import { Subject } from 'rxjs/src/Subject'
import { Observable } from 'rxjs/src/Observable'

import 'rxjs/src/add/operator/scan'
import 'rxjs/src/add/operator/do'
import 'rxjs/src/add/operator/filter'
import 'rxjs/src/add/operator/switchMap'
import 'rxjs/src/add/operator/distinctUntilChanged'
import 'rxjs/src/add/observable/empty'

import State from './state'


import 'rxjs/src/add/observable/of'
import 'rxjs/src/add/observable/zip'
import 'rxjs/src/add/operator/map'
import 'rxjs/src/add/operator/take'
import 'rxjs/src/add/operator/withLatestFrom'
import 'rxjs/src/add/operator/share'
import 'rxjs/src/add/operator/toPromise'
import 'rxjs/src/add/operator/switchMap'
import 'rxjs/src/add/operator/first'


/*
console.log('hello2')
const store = new Store()

store.history$.subscribe(history => {
  console.log('History:')
  console.dir(history)
})

const cb1 = (i: number) => {
  console.log("New val1:" + i)
}

console.log('registering')
store.register('val1', cb1)
console.log('updating')
store.update('val1', 1)
store.update('val1', 2)
console.log('---')
store.update('val1', 3)
console.log('rolling back')
store.rollback()
store.rollback()
store.rollback()
store.rollback()*/
