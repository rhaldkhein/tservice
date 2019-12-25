import Collection from './Collection'
import Provider from './Provider'
import * as shortid from 'shortid'

import { } from './index'

interface IMyClass {
  name: string
}

class MyClass implements IMyClass {
  name: string = shortid()
  constructor(prov: string) {
    console.log(prov);
  }
}

const col = new Collection
const prov = new Provider

col.add('myclass', MyClass, () => {
  return new MyClass('foo')
})

col.configure('myclass', () => {
  return { a: 1 }
})

prov.setCollection(col)

// - - - -

const mc1 = prov.get('myclass')
const mc2 = prov.get('myclass')

console.log(mc1);
console.log(mc2);