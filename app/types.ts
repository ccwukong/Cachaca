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

export type OrderItem = {
  id: string
  cartId: string
  currency: Currency
  amount: string
  voucher?: string
  shippingMethod: ShippingMethod
  shippingStatus: ShippingStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdBy?: string
  createdOn: number
  status: OrderStatus
}

export enum Role {
  ADMIN = 1,
  USER = 2,
}

export enum ShippingStatus {
  PENDING = 1,
  SHIPPED = 2,
  DELIVERED = 3,
  CANCELED = 5,
  FAILED = 6,
}

export enum PaymentStatus {
  PENDING = 1,
  CAPTURED = 2,
  COMPLETED = 3,
  PROCESSING = 4,
  CANCELED = 5,
  FAILED = 6,
}

export enum OrderStatus {
  PROCESSING = 1,
  REFUNDED = 2,
  PARTIAL_REFUNDED = 3,
  COMPLETED = 4,
  CANCELED = 5,
}

export enum PaymentMethod {
  CASH = 1,
  CREDIT_CARD = 2,
  PAYPAL = 3,
  STRIPE = 4,
  BANK_TRANSFER = 5,
}

export enum ShippingMethod {
  PICKUP = 1,
  DELIVERY = 2,
}
