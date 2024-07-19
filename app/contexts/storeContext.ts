import { createContext } from 'react'
import { CategoryItem, StoreSettings } from '~/types'

const initialValue: {
  storeSettings: StoreSettings | null
  categories: CategoryItem[]
} = {
  storeSettings: null,
  categories: [],
}

const StoreContext = createContext(initialValue)

export default StoreContext
