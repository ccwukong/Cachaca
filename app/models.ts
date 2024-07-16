/**
 * The models WILL NOT handle the exceptions
 */

import { and, asc, desc, eq } from 'drizzle-orm'
import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid'
import {
  APIConfig,
  CategoryItem,
  HomeBannerSettings,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentScheme,
  PaymentStatus,
  ProductPublicInfo,
  PublicPage,
  Role,
  ShippingMethod,
  ShippingStatus,
  StoreSettings,
  UserPublicInfo,
} from '~/types'
import {
  AccountExistsException,
  NotFoundException,
  ServerInternalError,
  UnAuthenticatedException,
} from '~/utils/exception'
import { makeStr } from '~/utils/string'
import db from '../db/connection'
import {
  api,
  checkoutItem,
  currency,
  customer,
  order,
  page,
  product,
  productCategory,
  productVariant,
  productVariantCategory,
  shop,
  user,
} from '../db/schema'

interface CRUDMode<T> {
  create(data: object): Promise<string | number>
  find(id: string | number): Promise<T>
  findMany(page: number, size: number): Promise<T[]>
  update(data: object): Promise<boolean>
  delete(id: string | number): Promise<boolean>
}

export class Installer {
  public static async isInstalled(): Promise<boolean> {
    const check = await db.select().from(shop)
    if (check.length) {
      return true
    } else {
      return false
    }
  }

  public static async create(data: {
    adminUser: {
      firstName: string
      lastName: string
      email: string
      phone: string
      password: string
    }
    store: {
      name: string
      description: string
    }
  }): Promise<UserPublicInfo> {
    const salt = makeStr(8)
    const adminId = uuidv4()
    const createdOn = Math.floor(Date.now() / 1000)
    const check = await db.select().from(shop)
    if (check.length) {
      throw new ServerInternalError('Store has already been created.')
    }

    await db.transaction(async (tx) => {
      const { adminUser, store } = data

      await tx.insert(user).values({
        id: adminId,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        salt,
        password: md5(adminUser.password + salt),
        phone: adminUser.phone,
        avatar: '',
        role: Role.Admin,
        createdOn,
        status: 1,
      })

      await tx.insert(shop).values({
        name: store.name,
        logo: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        baseCurrencyId: 1, //Default to USD
        description: store.description,
        createdBy: adminId,
        createdOn,
        status: 1,
      })
    })

    return {
      id: adminId,
      email: data.adminUser.email,
      firstName: data.adminUser.firstName,
      lastName: data.adminUser.lastName,
      phone: '',
      avatar: '',
      role: Role.Admin,
      createdOn,
    }
  }
}

export class AdminAuthtication {
  public static async login(
    email: string,
    password: string,
  ): Promise<UserPublicInfo> {
    const res = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.status, 1)))

    if (!res.length) {
      throw new UnAuthenticatedException('User not found.')
    }

    const userData = res[0]

    if (userData.password !== md5(password + userData.salt)) {
      throw new UnAuthenticatedException('Password is incorrect.')
    }

    return {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      role: userData.role,
      createdOn: userData.createdOn,
    }
  }
}

export class CustomerAuthentication {
  public static async register({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<{
    id: string
    email: string
    firstName: string
    lastName: string
  }> {
    const data = await db
      .select()
      .from(customer)
      .where(eq(customer.email, email))

    if (data.length) {
      throw new AccountExistsException()
    }

    const id = uuidv4()
    const salt = makeStr(8)
    await db.insert(customer).values({
      id,
      email,
      firstName,
      lastName,
      phone: '',
      avatar: '',
      salt,
      password: md5(password + salt),
      createdOn: Math.floor(Date.now() / 1000),
      status: 1,
    })

    return {
      id,
      email,
      firstName,
      lastName,
    }
  }

  public static async login(
    email: string,
    password: string,
  ): Promise<UserPublicInfo> {
    const res = await db
      .select()
      .from(customer)
      .where(and(eq(customer.email, email), eq(customer.status, 1)))

    if (!res.length) {
      throw new UnAuthenticatedException('Customer account not found.')
    }

    const userData = res[0]

    if (userData.password !== md5(password + userData.salt)) {
      throw new UnAuthenticatedException('Password is incorrect.')
    }

    return {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      createdOn: userData.createdOn,
    }
  }
}

export class UserModel implements CRUDMode<UserPublicInfo> {
  async create(data: {
    id: string
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
    role: Role
    avatar: string
  }): Promise<string> {
    const salt = makeStr(8)
    const { id, email, phone, password, firstName, lastName, role, avatar } =
      data

    const result = await db.insert(user).values({
      id,
      email,
      phone,
      password: md5(password + salt),
      salt,
      firstName,
      lastName,
      avatar,
      role,
      createdOn: Math.floor(Date.now() / 1000),
      status: 1,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return id
  }

  async find(id: string | number): Promise<UserPublicInfo> {
    const res = await db
      .select()
      .from(user)
      .where(eq(user.id, id as string))

    if (!res.length) {
      throw new NotFoundException()
    }

    const data: UserPublicInfo = {
      id: id as string,
      email: res[0].email,
      phone: res[0].phone,
      firstName: res[0].firstName,
      lastName: res[0].lastName,
      avatar: res[0].avatar,
      role: res[0].role,
      createdOn: res[0].createdOn,
      updatedOn: res[0].updatedOn || undefined,
    }

    return data
  }

  async findMany(page: number, size: number): Promise<UserPublicInfo[]> {
    const res = await db
      .select()
      .from(user)
      .orderBy(desc(user.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        email: item.email,
        phone: item.phone,
        firstName: item.firstName,
        lastName: item.lastName,
        avatar: item.avatar,
        role: item.role,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn || undefined,
      }
    })
  }

  async update(data: UserPublicInfo): Promise<boolean> {
    await db
      .update(user)
      .set({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        role: data.role,
        updatedOn: Math.floor(Date.now() / 1000),
      })
      .where(eq(user.id, data.id))

    return true
  }

  async delete(id: string): Promise<boolean> {
    await db
      .update(user)
      .set({
        status: 0,
      })
      .where(eq(user.id, id))

    return true
  }
}

export class CustomerModel implements CRUDMode<UserPublicInfo> {
  async create(data: {
    id: string
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
    avatar: string
  }): Promise<string> {
    const salt = makeStr(8)
    const { id, email, phone, password, firstName, lastName, avatar } = data

    const result = await db.insert(customer).values({
      id,
      email,
      phone,
      password: md5(password + salt),
      salt,
      firstName,
      lastName,
      avatar,
      createdOn: Math.floor(Date.now() / 1000),
      status: 1,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return id
  }

  async find(id: string | number): Promise<UserPublicInfo> {
    const res = await db
      .select()
      .from(customer)
      .where(eq(customer.id, id as string))

    if (!res.length) {
      throw new NotFoundException()
    }

    const data: UserPublicInfo = {
      id: id as string,
      email: res[0].email,
      phone: res[0].phone,
      firstName: res[0].firstName,
      lastName: res[0].lastName,
      avatar: res[0].avatar,
      createdOn: res[0].createdOn,
      updatedOn: res[0].updatedOn || undefined,
      status: res[0].status,
    }

    return data
  }

  async findMany(page: number, size: number): Promise<UserPublicInfo[]> {
    const res = await db
      .select()
      .from(customer)
      .orderBy(desc(customer.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        email: item.email,
        phone: item.phone,
        firstName: item.firstName,
        lastName: item.lastName,
        avatar: item.avatar,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn || undefined,
        status: item.status,
      }
    })
  }

  async update(data: UserPublicInfo): Promise<boolean> {
    await db
      .update(customer)
      .set({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        updatedOn: Math.floor(Date.now() / 1000),
      })
      .where(eq(user.id, data.id))
    return true
  }

  async delete(id: string): Promise<boolean> {
    await db
      .update(customer)
      .set({
        status: 0,
      })
      .where(eq(user.id, id))

    return true
  }
}

export class ProductModel implements CRUDMode<ProductPublicInfo> {
  async create(data: {
    id: string
    slug: string
    name: string
    description: string
    coverImage: string
    basePrice: string
    categoryId: string
    subCategoryId: string
    createdBy: string
  }): Promise<string> {
    const {
      id,
      slug,
      name,
      description,
      coverImage,
      basePrice,
      categoryId,
      subCategoryId,
      createdBy,
    } = data

    const result = await db.insert(product).values({
      id,
      slug,
      name,
      description,
      coverImage,
      basePrice,
      categoryId,
      subCategoryId,
      createdBy,
      createdOn: Math.floor(Date.now() / 1000),
      status: 1,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return id
  }

  async find(id: string): Promise<ProductPublicInfo> {
    const res = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        basePrice: product.basePrice,
        coverImage: product.coverImage,
        category: {
          id: productCategory.id,
          name: productCategory.name,
          slug: productCategory.slug,
        },
      })
      .from(product)
      .leftJoin(productCategory, eq(product.categoryId, productCategory.id))
      .where(eq(product.id, id))

    if (!res.length) {
      throw new NotFoundException()
    }

    return {
      id,
      name: res[0].name,
      slug: res[0].slug,
      description: res[0].description,
      basePrice: res[0].basePrice,
      coverImage: res[0].coverImage,
      category: res[0].category as CategoryItem,
    }
  }

  async findMany(page: number, size: number): Promise<ProductPublicInfo[]> {
    const res = await db
      .select()
      .from(user)
      .orderBy(desc(user.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        email: item.email,
        phone: item.phone,
        firstName: item.firstName,
        lastName: item.lastName,
        avatar: item.avatar,
        role: item.role,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn || undefined,
      }
    })
  }

  async update(): Promise<boolean> {
    return true
  }

  async delete(): Promise<boolean> {
    return true
  }
}

export class StoreConfig {
  public static async getHomeBanners(): Promise<HomeBannerSettings> {
    return {
      autoplay: banners.autoplay,
      speed: banners.speed,
      bannerItems: banners.items,
    }
  }

  public static async getStoreInfo(): Promise<StoreSettings> {
    return {
      name: settings.name,
      logo: settings.logo,
      description: settings.description,
      currency: settings.currency,
      pageLinks: settings.pageLinks,
      copyright: settings.copyright,
    }
  }

  public static async getPublicPages(): Promise<PublicPage[]> {
    const res = await db.select().from(page).orderBy(asc(page.order))

    return res.map((item) => {
      return {
        name: item.name,
        slug: item.slug,
        content: item.content,
        order: item.order,
      }
    })
  }

  public static async getPublicPageByName(name: string): Promise<PublicPage> {
    const res = await db
      .select()
      .from(page)
      .where(and(eq(page.name, name), eq(page.status, 1)))

    if (!res.length) {
      throw new NotFoundException()
    }

    return {
      name: res[0].name,
      slug: res[0].slug,
      content: res[0].content,
      order: res[0].order,
    }
  }

  public static async getAllAPIConfigs(): Promise<APIConfig[]> {
    const res = await db.select().from(api)

    if (!res.length) {
      throw new NotFoundException()
    }

    return res.map((item) => {
      return {
        id: item.id,
        config: item.config,
      }
    })
  }

  public static async updateAPIConfig(data: APIConfig): Promise<boolean> {
    await db
      .update(api)
      .set({
        config: data.config,
      })
      .where(eq(api.id, data.id))

    return true
  }
}

export class OrderModel implements CRUDMode<OrderItem> {
  async create(data: {
    id: string
    checkoutId: string
    currencyId: number
    amount: string
    customerId: string
    discount?: string
    tax: string
    taxRate: string
    voucher?: string
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
    note?: string
  }): Promise<string> {
    const result = await db.insert(order).values({
      ...data,
      discount: data.discount ?? '',
      voucher: data.voucher ?? '',
      note: data.note ?? '',
      createdBy: data.customerId,
      createdOn: Math.floor(Date.now() / 1000),
      status: OrderStatus.Pending,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return data.id
  }

  async find(id: string): Promise<OrderItem> {
    const res = await db
      .select({
        id: order.id,
        amount: order.amount,
        discount: order.discount,
        tax: order.tax,
        taxRate: order.taxRate,
        voucher: order.voucher,
        checkoutId: order.checkoutId,
        currency: {
          id: currency.id,
          name: currency.name,
          code: currency.code,
          symbol: currency.symbol,
        },
        customer: {
          id: customer.id,
          email: customer.email,
          phone: customer.phone,
          firstName: customer.firstName,
          lastName: customer.lastName,
          avatar: customer.avatar,
        },
        shippingAddress: order.shippingAddress,
        shippingMethod: order.shippingMethod,
        shippingStatus: order.shippingStatus,
        shippingFee: order.shippingFee,
        shippingReference: order.shippingReference,
        shippingTracking: order.shippingTracking,
        paymentMethod: order.paymentMethod,
        paymentScheme: order.paymentScheme,
        paymentInstrument: order.paymentInstrument,
        paymentReference: order.paymentReference,
        paymentStatus: order.paymentStatus,
        billingAddress: order.billingAddress,
        note: order.note,
        createOn: order.createdOn,
        status: order.status,
      })
      .from(order)
      .leftJoin(currency, eq(order.currencyId, currency.id))
      .leftJoin(customer, eq(order.customerId, customer.id))
      .where(eq(order.id, id))

    if (!res.length) {
      throw new NotFoundException()
    }

    const cartItems = await db
      .select({
        id: checkoutItem.id,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          basePrice: product.basePrice,
          coverImage: product.coverImage,
        },
        productVariant: {
          id: productVariant.id,
          name: productVariant.name,
          coverImage: productVariant.coverImage,
          description: productVariant.description,
          sku: productVariant.sku,
          priceVariant: productVariant.priceVariant,
        },
        variantCategory: {
          id: productVariantCategory.id,
          name: productVariantCategory.name,
        },
        unitPrice: checkoutItem.unitPrice,
        quantity: checkoutItem.quantity,
      })
      .from(checkoutItem)
      .leftJoin(
        productVariant,
        eq(checkoutItem.productVariantId, productVariant.id),
      )
      .leftJoin(product, eq(productVariant.productId, product.id))
      .leftJoin(
        productVariantCategory,
        eq(productVariant.variantCategoryId, productVariantCategory.id),
      )
      .where(eq(checkoutItem.checkoutId, res[0].checkoutId))

    return {
      id: res[0].id,
      amount: res[0].amount,
      discount: res[0].discount,
      tax: res[0].tax,
      taxRate: res[0].taxRate,
      voucher: res[0].voucher,
      checkout: {
        id: res[0].checkoutId,
        currency: res[0].currency!,
        customer: res[0].customer as UserPublicInfo,
        items: cartItems.map((item) => {
          return {
            id: item.id,
            product: item.product as ProductPublicInfo,
            productVariant: item.productVariant!,
            productVariantCategory: item.variantCategory!,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          }
        }),
      },
      currency: res[0].currency!,
      customer: res[0].customer as UserPublicInfo,
      shippingAddress: res[0].shippingAddress,
      shippingMethod: res[0].shippingMethod,
      shippingStatus: res[0].shippingStatus,
      shippingFee: res[0].shippingFee,
      shippingReference: res[0].shippingReference,
      shippingTracking: res[0].shippingTracking,
      paymentMethod: res[0].paymentMethod,
      paymentScheme: res[0].paymentScheme,
      paymentInstrument: res[0].paymentInstrument,
      paymentReference: res[0].paymentReference,
      paymentStatus: res[0].paymentStatus,
      billingAddress: res[0].billingAddress,
      note: res[0].note,
      createdOn: res[0].createOn,
      status: res[0].status,
    }
  }

  async findMany(page: number, size: number): Promise<OrderItem[]> {
    return []
  }

  async update(): Promise<boolean> {
    return true
  }

  async delete(): Promise<boolean> {
    return true
  }
}
