export type Currency = {
  id: number
  code: string
  symbol: string
  name: string
}

export type ProductPublicInfo = {
  id: string
  name: string
  slug: string
  description: string
  basePrice: string
  coverImage: string
  categoryId: number
  subCategoryId: number
  images: string[]
}

export type UserPublicInfo = {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  avatar: string
  role: number
  createdOn: number
  updatedOn?: number
}

export type CartItemInfo = {
  title: string
  slug: string
  coverImage: string
  price: string
  quantity: number
}

export type CategoryItem = {
  id: number
  name: string
  slug: string
  subCategories?: CategoryItem[]
}

export type BannerItem = {
  imageUrl: string
  link: string
  caption: string
  order: number
}

export type HomeBannerSettings = {
  autoplay: boolean
  speed: number
  bannerItems: BannerItem[]
}

export type PageLink = {
  title: string
  url: string
  order: number
}

export type StoreSettings = {
  name: string
  logo: string
  description: string
  currency: Currency
  pageLinks: PageLink[]
  copyright: string
}

export enum Role {
  ADMIN = 1,
  USER = 2,
}
