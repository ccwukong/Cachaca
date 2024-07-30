import { createContext } from 'react'
import { CategoryItem, PublicPage, StoreSettings } from '~/types'

const initialValue: {
  storeSettings: StoreSettings | null
  categories: CategoryItem[]
  publicPages: PublicPage[]
} = {
  storeSettings: null,
  categories: [],
  publicPages: [],
}

const StoreContext = createContext(initialValue)

export default StoreContext
