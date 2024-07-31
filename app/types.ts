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
  category: CategoryItem
  variants: ProductVariant[]
}

export type ProductVariant = {
  id: string
  name: string
  description: string
  coverImage: string
  priceVariant: string
  sku: string
  quantity?: number
}

export type ProductVariantCategoryItem = {
  id: number
  name: string
}

export type UserPublicInfo = {
  id: string
  email: string
  phone: string
  firstName: string
  lastName: string
  avatar: string
  role: number
  createdOn?: number
  updatedOn?: number | null
  status?: number
}

export type CartItem = {
  id: string
  name: string
  slug: string
  coverImage: string
  price: string
  quantity: number
}

export type CategoryItem = {
  id: string
  name: string
  slug: string
  parentId: string | null
}

export type BannerItem = {
  id: string
  imageUrl: string
  link: string
  caption: string
  order: number
}

export type HomeBannerSettings = {
  autoplay: boolean
  speed: number
  items: BannerItem[]
}

export type OtherStoreConfigs = {
  copyright: string
  apis: APIConfig
}

export type PageLink = {
  title: string
  url: string
  order: number
}

export type StoreSettings = {
  name: string
  logo: string
  email: string
  phone: string
  address: AddressItem | null
  description: string
  currency: Currency
  other: OtherStoreConfigs | null
  banners: HomeBannerSettings | null
}

export type CheckoutInfo = {
  id: string
  customer: UserPublicInfo
  currency: Currency
  items: CheckoutItem[]
}

export type CheckoutItem = {
  id: string
  product: ProductPublicInfo
  productVariant: ProductVariant
  productVariantCategory: ProductVariantCategoryItem
  unitPrice: string
  quantity: number
}

export type OrderItem = {
  id: string
  checkout: CheckoutInfo
  customer: UserPublicInfo
  currency: Currency
  amount: string
  discount: string
  tax: string
  taxRate: string
  voucher: string
  shippingAddress: string
  shippingMethod: ShippingMethod
  shippingStatus: ShippingStatus
  shippingFee: string
  shippingReference: string
  shippingTracking: string
  paymentMethod: PaymentMethod
  paymentScheme: PaymentScheme
  paymentInstrument: string
  paymentReference: string
  paymentStatus: PaymentStatus
  billingAddress: string
  note: string
  createdBy?: string
  createdOn: number
  status: OrderStatus
}

export type PublicPage = {
  name: string
  slug: string
  content: string
  order: number
}

export type APIConfig = {
  [key in ExternalApiType]: { [key: string]: string | number }
}

export type AddressItem = {
  id: string
  address: string
  city: string
  state: string
  country: string
  zipcode: string
  type: AddressType
}

export type EmailTemplateItem = {
  name: string
  subject: string
  content: string
}

export enum AddressType {
  Shipping = 1,
  Billing = 2,
  Store = 3,
  Other = 4,
}

export enum Role {
  Admin = 1,
  User = 2,
  Customer = 3,
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
  Deleted = 0,
  Pending = 1,
  Processing = 2,
  Refunded = 3,
  PartialRefunded = 4,
  Completed = 5,
  Canceled = 6,
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

export enum PaymentScheme {
  Visa = 1,
  Master = 2,
  AmericanExpress = 3,
  Discover = 4,
  JCB = 5,
  DinersClub = 6,
  UnionPay = 7,
  Other = 8,
}

export enum ExternalApiType {
  GenAI = 1,
  File = 2,
  Email = 3,
}

export enum FileHostingProvider {
  Cloudinary = 1,
}

export enum FatalErrorTypes {
  DatabaseConnection = 'ECONNREFUSED',
}

export enum DatabaseRecordStatus {
  Deleted = -1,
  Disabled = 0,
  Active = 1,
}

export enum EmailTemplate {
  ForgotPassword = 'forgot_password_template',
}
