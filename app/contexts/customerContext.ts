import { createContext } from 'react'
import { StoreSettings, UserPublicInfo } from '~/types'

const initialValue: {
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
} = {
  account: null,
  storeSettings: null,
}

const CustomerContext = createContext(initialValue)

export default CustomerContext
