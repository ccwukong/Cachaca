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
  Admin = 1,
  User = 2,
}

export enum ShippingStatus {
  Pending = 1,
  Shipped = 2,
  Delivered = 3,
  Canceled = 5,
  Failed = 6,
}

export enum PaymentStatus {
  Pending = 1,
  Captured = 2,
  Completed = 3,
  Processing = 4,
  Canceled = 5,
  Failed = 6,
}

export enum OrderStatus {
  Processing = 1,
  Refunded = 2,
  PartialRefunded = 3,
  Completed = 4,
  Canceled = 5,
}

export enum PaymentMethod {
  Cash = 1,
  CreditCard = 2,
  Paypal = 3,
  Stripe = 4,
  BankTransfer = 5,
  CashOnDelivery = 6,
}

export enum ShippingMethod {
  PickUp = 1,
  Delivery = 2,
}
