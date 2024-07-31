/**
 * The models WILL NOT handle the exceptions
 */

import { and, asc, desc, eq, ne, or } from 'drizzle-orm'
import md5 from 'md5'
import {
  AddressItem,
  AddressType,
  CategoryItem,
  Currency,
  DatabaseRecordStatus,
  EmailTemplateItem,
  HomeBannerSettings,
  OrderItem,
  OrderStatus,
  OtherStoreConfigs,
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
  UnmatchedPassword,
} from '~/utils/exception'
import { makeStr } from '~/utils/string'
import db from '../db/connection'
import {
  checkoutItem,
  currency,
  customer,
  customerAddress,
  emailTemplate,
  order,
  page,
  product,
  productCategory,
  productVariant,
  productVariantCategory,
  shop,
  user,
} from '../db/schema'

interface CRUDModel<T> {
  create(data: object): Promise<string | number>
  find(id: string | number): Promise<T>
  findMany(page: number, size: number): Promise<T[]>
  update(data: object): Promise<void>
  delete(id: string | number): Promise<void>
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
      id: string
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
    const createdOn = Math.floor(Date.now() / 1000)
    const check = await db.select().from(shop)
    if (check.length) {
      throw new ServerInternalError('Store has already been created.')
    }
    const { adminUser, store } = data

    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id: adminUser.id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        salt,
        password: md5(adminUser.password + salt),
        phone: adminUser.phone,
        avatar: '',
        role: Role.Admin,
        createdOn,
        status: DatabaseRecordStatus.Active,
      })

      const storeData = {
        name: store.name,
        logo: '',
        email: '',
        phone: '',
        baseCurrencyId: 1, //Default to USD
        description: store.description,
        banners: { autoplay: false, speed: 0, items: [] },
        other: {
          copyright: `${store.name} ©${new Date().getFullYear()}`,
          apis: {},
        } as OtherStoreConfigs,
        createdBy: adminUser.id,
        createdOn,
        status: DatabaseRecordStatus.Active,
      }

      await tx.insert(shop).values(storeData)
    })

    return {
      id: adminUser.id,
      email: data.adminUser.email,
      firstName: data.adminUser.firstName,
      lastName: data.adminUser.lastName,
      phone: '',
      avatar: '',
      role: Role.Admin,
    }
  }
}

export class AdminAuthentication {
  public static async login(
    email: string,
    password: string,
  ): Promise<UserPublicInfo> {
    const res = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, email),
          eq(user.status, DatabaseRecordStatus.Active),
        ),
      )

    if (!res.length) {
      throw new UnAuthenticatedException()
    }

    const userData = res[0]

    if (userData.password !== md5(password + userData.salt)) {
      throw new UnAuthenticatedException()
    }

    return {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: userData.avatar,
      role: userData.role,
    }
  }

  public static async updatePassword({
    email,
    oldPwd,
    newPwd,
  }: {
    email: string
    oldPwd: string
    newPwd: string
  }): Promise<void> {
    const res = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, email),
          eq(user.status, DatabaseRecordStatus.Active),
        ),
      )

    if (!res.length) {
      throw new UnAuthenticatedException()
    }

    const userData = res[0]

    if (userData.password !== md5(oldPwd + userData.salt)) {
      throw new UnmatchedPassword()
    }

    const newSalt = makeStr(8)
    await db
      .update(user)
      .set({ password: md5(newPwd + newSalt), salt: newSalt })
      .where(
        and(
          eq(user.email, email),
          eq(user.status, DatabaseRecordStatus.Active),
        ),
      )
  }

  public static async resetPassword({
    email,
    newPwd,
  }: {
    email: string
    newPwd: string
  }): Promise<void> {
    const newSalt = makeStr(8)

    await db
      .update(user)
      .set({ password: md5(newPwd + newSalt), salt: newSalt })
      .where(
        and(
          eq(user.email, email),
          eq(user.status, DatabaseRecordStatus.Active),
        ),
      )
  }

  public static async getAdminNameByEmailIfRegistered(
    email: string,
  ): Promise<{ [key: string]: string } | null> {
    const res = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, email),
          eq(user.status, DatabaseRecordStatus.Active),
        ),
      )

    if (res.length) {
      return {
        firstName: res[0].firstName,
        lastName: res[0].lastName,
      }
    } else {
      return null
    }
  }
}

export class CustomerAuthentication {
  public static async register({
    id,
    email,
    password,
    firstName,
    lastName,
  }: {
    id: string
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
      status: DatabaseRecordStatus.Active,
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
      .where(
        and(
          eq(customer.email, email),
          eq(customer.status, DatabaseRecordStatus.Active),
        ),
      )

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
      role: Role.Customer,
    }
  }

  public static async updatePassword({
    email,
    oldPwd,
    newPwd,
  }: {
    email: string
    oldPwd: string
    newPwd: string
  }): Promise<void> {
    const res = await db
      .select()
      .from(customer)
      .where(
        and(
          eq(customer.email, email),
          eq(customer.status, DatabaseRecordStatus.Active),
        ),
      )

    if (!res.length) {
      throw new UnAuthenticatedException()
    }

    const userData = res[0]

    if (userData.password !== md5(oldPwd + userData.salt)) {
      throw new UnmatchedPassword()
    }

    const newSalt = makeStr(8)

    await db
      .update(customer)
      .set({ password: md5(newPwd + newSalt), salt: newSalt })
      .where(
        and(
          eq(customer.email, email),
          eq(customer.status, DatabaseRecordStatus.Active),
        ),
      )
  }

  public static async resetPassword({
    email,
    newPwd,
  }: {
    email: string
    newPwd: string
  }): Promise<void> {
    const newSalt = makeStr(8)

    await db
      .update(customer)
      .set({ password: md5(newPwd + newSalt), salt: newSalt })
      .where(
        and(
          eq(customer.email, email),
          eq(customer.status, DatabaseRecordStatus.Active),
        ),
      )
  }

  public static async getCustommerNameByEmailIfRegistered(
    email: string,
  ): Promise<{ [key: string]: string } | null> {
    const res = await db
      .select()
      .from(customer)
      .where(
        and(
          eq(customer.email, email),
          eq(customer.status, DatabaseRecordStatus.Active),
        ),
      )

    if (res.length) {
      return {
        firstName: res[0].firstName,
        lastName: res[0].lastName,
      }
    } else {
      return null
    }
  }
}

export class UserModel implements CRUDModel<UserPublicInfo> {
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
      status: DatabaseRecordStatus.Active,
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
      .where(
        and(
          eq(user.id, id as string),
          ne(user.status, DatabaseRecordStatus.Deleted), // customer account could be disabled temporarily
        ),
      )

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
      updatedOn: res[0].updatedOn,
      status: res[0].status,
    }

    return data
  }

  async findMany(page: number, size: number): Promise<UserPublicInfo[]> {
    const res = await db
      .select()
      .from(user)
      .where(ne(user.status, DatabaseRecordStatus.Deleted))
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
        updatedOn: item.updatedOn,
        status: item.status,
      }
    })
  }

  async update(data: {
    id: string
    phone: string
    firstName: string
    lastName: string
    avatar: string
  }): Promise<void> {
    await db
      .update(user)
      .set({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        updatedOn: Math.floor(Date.now() / 1000),
      })
      .where(eq(user.id, data.id))
  }

  async delete(id: string): Promise<void> {
    await db
      .update(user)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(user.id, id))
  }
}

export class CustomerModel implements CRUDModel<UserPublicInfo> {
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
      status: DatabaseRecordStatus.Active,
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
      .where(
        and(
          eq(customer.id, id as string),
          ne(customer.status, DatabaseRecordStatus.Deleted),
        ),
      )

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
      role: Role.Customer,
      createdOn: res[0].createdOn,
      updatedOn: res[0].updatedOn,
      status: res[0].status,
    }

    return data
  }

  async findMany(page: number, size: number): Promise<UserPublicInfo[]> {
    const res = await db
      .select()
      .from(customer)
      .where(and(ne(customer.status, DatabaseRecordStatus.Deleted)))
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
        role: Role.Customer,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn,
        status: item.status,
      }
    })
  }

  async update(data: {
    id: string
    phone: string
    firstName: string
    lastName: string
    avatar: string
  }): Promise<void> {
    await db
      .update(customer)
      .set({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        updatedOn: Math.floor(Date.now() / 1000),
      })
      .where(eq(customer.id, data.id))
  }

  async delete(id: string): Promise<void> {
    await db
      .update(customer)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(user.id, id))
  }
}

export class ProductModel implements CRUDModel<ProductPublicInfo> {
  async create(data: {
    id: string
    slug: string
    name: string
    description: string
    coverImage: string
    basePrice: string
    categoryId: string
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
      createdBy,
      createdOn: Math.floor(Date.now() / 1000),
      status: DatabaseRecordStatus.Active,
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
          parentId: productCategory.parentId,
        },
      })
      .from(product)
      .leftJoin(productCategory, eq(product.categoryId, productCategory.id))
      .where(
        and(
          eq(product.id, id),
          ne(product.status, DatabaseRecordStatus.Deleted),
        ),
      )

    const variants = await db
      .select({
        id: productVariant.id,
        name: productVariant.name,
        description: productVariant.description,
        priceVariant: productVariant.priceVariant,
        quantity: productVariant.quantity,
        sku: productVariant.sku,
        coverImage: productVariant.coverImage,
      })
      .from(productVariant)
      .leftJoin(
        productVariantCategory,
        eq(productVariant.variantCategoryId, productVariantCategory.id),
      )
      .where(
        and(
          eq(product.id, id),
          ne(productVariant.status, DatabaseRecordStatus.Deleted),
        ),
      )

    return {
      id,
      name: res[0].name,
      slug: res[0].slug,
      description: res[0].description,
      basePrice: res[0].basePrice,
      coverImage: res[0].coverImage,
      category: res[0].category as CategoryItem,
      variants,
    }
  }

  async findMany(page: number, size: number): Promise<ProductPublicInfo[]> {
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
          parentId: productCategory.parentId,
        },
      })
      .from(product)
      .leftJoin(productCategory, eq(product.categoryId, productCategory.id))
      .where(ne(product.status, DatabaseRecordStatus.Deleted))
      .orderBy(desc(product.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        basePrice: item.basePrice,
        coverImage: item.coverImage,
        category: item.category as CategoryItem,
        variants: [],
      }
    })
  }

  async findManyByCategory(
    page: number,
    size: number,
    categoryId: string,
  ): Promise<ProductPublicInfo[]> {
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
      .where(
        or(
          eq(product.categoryId, categoryId),
          ne(product.status, DatabaseRecordStatus.Deleted),
        ),
      )
      .orderBy(desc(product.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        basePrice: item.basePrice,
        coverImage: item.coverImage,
        category: item.category as CategoryItem,
        variants: [],
      }
    })
  }

  async update(): Promise<void> {}

  async delete(id: string): Promise<void> {
    await db
      .update(product)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(product.id, id))
  }
}

export class ProductCategoryModel implements CRUDModel<CategoryItem> {
  async create(data: {
    id: string
    slug: string
    name: string
    parentId?: string
  }): Promise<string> {
    const { id, slug, name, parentId } = data

    const result = await db.insert(productCategory).values({
      id,
      slug,
      name,
      parentId: parentId ?? null,
      status: DatabaseRecordStatus.Active,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return id
  }

  async find(id: string): Promise<CategoryItem> {
    const res = await db
      .select()
      .from(productCategory)
      .where(
        and(
          eq(productCategory.id, id),
          ne(productCategory.status, DatabaseRecordStatus.Deleted),
        ),
      )

    if (!res.length) {
      throw new NotFoundException()
    }

    return {
      id: res[0].id,
      name: res[0].name,
      slug: res[0].slug,
      parentId: res[0].parentId,
    }
  }

  async findMany(page: number, size: number): Promise<CategoryItem[]> {
    const res = await db
      .select()
      .from(productCategory)
      .where(ne(productCategory.status, DatabaseRecordStatus.Deleted))
      .orderBy(asc(productCategory.name))
      .limit(size)
      .offset(page * size)

    if (!res.length) {
      throw new NotFoundException()
    }

    return res.map((item) => {
      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        parentId: item.parentId,
      }
    })
  }

  async update(data: CategoryItem): Promise<void> {
    await db
      .update(productCategory)
      .set({
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
      })
      .where(eq(productCategory.id, data.id))
  }

  async delete(id: string): Promise<void> {
    await db
      .update(productCategory)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(productCategory.id, id))
  }
}

export class StoreConfig {
  public static async getStoreInfo(): Promise<StoreSettings> {
    const sdata = await db
      .select()
      .from(shop)
      .leftJoin(currency, eq(shop.baseCurrencyId, currency.id))

    if (!sdata.length) {
      throw new NotFoundException()
    }

    return {
      name: sdata[0].shop.name,
      logo: sdata[0].shop.logo,
      email: sdata[0].shop.email || '',
      phone: sdata[0].shop.phone || '',
      address: sdata[0].shop.address,
      description: sdata[0].shop.description || '',
      currency: {
        id: sdata[0]?.currency?.id as number,
        name: sdata[0]?.currency?.name || '',
        code: sdata[0]?.currency?.code || '',
        symbol: sdata[0]?.currency?.symbol || '',
      },
      other: sdata[0].shop.other,
      banners: sdata[0].shop.banners,
    }
  }

  public static async getCurrencies(): Promise<Currency[]> {
    const data = await db.select().from(currency)
    if (!data.length) {
      throw new NotFoundException()
    }

    return data
  }

  public static async updateStoreInfo(data: {
    name: string
    logo: string
    email: string
    phone: string
    address: AddressItem
    description: string
    baseCurrencyId: number
    other: OtherStoreConfigs
  }): Promise<void> {
    await db
      .update(shop)
      .set({
        email: data.email,
        phone: data.phone,
        address: data.address,
        description: data.description,
        baseCurrencyId: data.baseCurrencyId,
        other: data.other,
      })
      .where(eq(shop.name, data.name))
  }

  public static async updateStoreBanners(data: {
    name: string
    banners: HomeBannerSettings
  }): Promise<void> {
    await db
      .update(shop)
      .set({
        banners: data.banners,
      })
      .where(eq(shop.name, data.name))
  }

  public static async updateStoreLogo(data: {
    name: string
    logo: string
  }): Promise<void> {
    await db
      .update(shop)
      .set({
        logo: data.logo,
      })
      .where(eq(shop.name, data.name))
  }

  public static async getPublicPages(): Promise<PublicPage[]> {
    const res = await db
      .select()
      .from(page)
      .where(eq(page.status, DatabaseRecordStatus.Active))
      .orderBy(asc(page.order))

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
      .where(
        and(eq(page.name, name), eq(page.status, DatabaseRecordStatus.Active)),
      )

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

  public static async createPublicPage(data: {
    name: string
    slug: string
    content: string
    order: number
  }): Promise<string> {
    const result = await db.insert(page).values({
      ...data,
      status: DatabaseRecordStatus.Active,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return data.name
  }

  public static async updatePublicPageByName(data: {
    name: string
    slug: string
    content: string
    order: number
  }): Promise<void> {
    await db
      .update(page)
      .set({
        slug: data.slug,
        content: data.content,
        order: data.order,
      })
      .where(eq(page.name, data.name))
  }

  public static async deletePublicPageByName(name: string): Promise<void> {
    await db.delete(page).where(eq(page.name, name))
  }

  public static async getEmailTemplates(): Promise<EmailTemplateItem[]> {
    const data = await db
      .select({
        name: emailTemplate.name,
        subject: emailTemplate.subject,
        content: emailTemplate.content,
      })
      .from(emailTemplate)
      .orderBy(asc(emailTemplate.name))

    return data
  }

  public static async getEmailTemplateByName(
    name: string,
  ): Promise<EmailTemplateItem> {
    const data = await db
      .select({
        name: emailTemplate.name,
        subject: emailTemplate.subject,
        content: emailTemplate.content,
      })
      .from(emailTemplate)
      .where(eq(emailTemplate.name, name))

    if (!data.length) {
      throw new NotFoundException()
    }

    return data[0]
  }

  public static async createEmailTemplate(data: {
    name: string
    subject: string
    content: string
  }): Promise<string> {
    const result = await db.insert(emailTemplate).values({
      name: data.name,
      subject: data.subject,
      content: data.content,
      status: DatabaseRecordStatus.Active,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return data.name
  }

  public static async updateEmailTemplateByName(data: {
    name: string
    subject: string
    content: string
  }): Promise<void> {
    await db
      .update(emailTemplate)
      .set({
        subject: data.subject,
        content: data.content,
      })
      .where(eq(emailTemplate.name, data.name))
  }

  public static async deleteEmailTemplateByName(name: string): Promise<void> {
    await db.delete(emailTemplate).where(eq(emailTemplate.name, name))
  }
}

export class OrderModel implements CRUDModel<OrderItem> {
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
    console.log(page, size)
    return []
  }

  async update(): Promise<void> {}

  async delete(id: string): Promise<void> {
    await db
      .update(order)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(order.id, id))
  }
}

export class AddressModel implements CRUDModel<AddressItem> {
  async create(data: {
    id: string
    customerId: string
    address: string
    city: string
    state: string
    country: string
    zipcode: string
    type: AddressType
  }): Promise<string> {
    const { id, customerId, address, city, state, country, zipcode, type } =
      data

    const result = await db.insert(customerAddress).values({
      id,
      customerId,
      address,
      city,
      state,
      country,
      zipcode,
      type,
      createdOn: Math.floor(Date.now() / 1000),
      status: DatabaseRecordStatus.Active,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return id
  }

  async find(id: string): Promise<AddressItem> {
    const res = await db
      .select()
      .from(customerAddress)
      .where(
        and(
          eq(customerAddress.id, id),
          ne(customer.status, DatabaseRecordStatus.Deleted),
        ),
      )

    if (!res.length) {
      throw new NotFoundException()
    }

    return {
      id: res[0].id,
      address: res[0].address || '',
      city: res[0].city || '',
      state: res[0].state || '',
      country: res[0].country || '',
      zipcode: res[0].zipcode || '',
      type: res[0].type,
    }
  }

  async findManyByCustomerId(id: string): Promise<AddressItem[]> {
    const res = await db
      .select()
      .from(customerAddress)
      .where(
        and(
          eq(customerAddress.customerId, id),
          ne(customerAddress.status, DatabaseRecordStatus.Deleted),
        ),
      )

    return res.map((item) => {
      return {
        id: item.id,
        address: item.address || '',
        city: item.city || '',
        state: item.state || '',
        country: item.country || '',
        zipcode: item.zipcode || '',
        type: item.type,
      }
    })
  }

  async findMany(page: number, size: number): Promise<AddressItem[]> {
    const res = await db
      .select()
      .from(customerAddress)
      .where(ne(customerAddress.status, DatabaseRecordStatus.Deleted))
      .orderBy(desc(customerAddress.createdOn))
      .limit(size)
      .offset(page * size)

    return res.map((item) => {
      return {
        id: item.id,
        address: item.address || '',
        city: item.city || '',
        state: item.state || '',
        country: item.country || '',
        zipcode: item.zipcode || '',
        type: item.type,
      }
    })
  }

  async update(data: AddressItem): Promise<void> {
    await db
      .update(customerAddress)
      .set({
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipcode: data.zipcode,
      })
      .where(eq(customerAddress.id, data.id))
  }

  async delete(id: string): Promise<void> {
    await db
      .update(customerAddress)
      .set({
        status: DatabaseRecordStatus.Deleted,
      })
      .where(eq(customerAddress.id, id))
  }
}
