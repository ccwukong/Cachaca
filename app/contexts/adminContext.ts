import { createContext } from 'react';
import {
  CategoryItem,
  EmailTemplateItem,
  PublicPage,
  StoreSettings,
  UserPublicInfo,
} from '~/types';

const initialValue: {
  navItems: { title: string; url: string; order: number }[]
  account: UserPublicInfo | null
  storeSettings: StoreSettings | null
  publicPages?: PublicPage[]
  emailTemplates?: EmailTemplateItem[]
  categoryItem?: CategoryItem[]
} = {
  navItems: [],
  account: null,
  storeSettings: null,
  publicPages: [],
  emailTemplates: [],
  categoryItem: [],
}

const AdminContext = createContext(initialValue)

export default AdminContext
