import Dexie, { type EntityTable } from 'dexie'
import { CartItem } from '~/types'

type LocalCartItem = CartItem & { url: string }
const idb = new Dexie('cart') as Dexie & {
  cart: EntityTable<LocalCartItem, 'id'>
}

idb.version(1).stores({
  cart: '++id',
})

export type { LocalCartItem }
export { idb }
