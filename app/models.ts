/**
 * The models WILL NOT handle the exceptions
 */

import { eq, desc } from 'drizzle-orm'
import md5 from 'md5'
import { user } from '../db/schema'
import db from '../db/connection'
import { makeStr } from '~/utils/string'
import { ServerInternalError } from '~/utils/exception'

interface CRUDMode<T> {
  find(id: string | number): Promise<T | null>
  findMany(page: number, size: number): Promise<T[]>
  update(id: string | number, data: object): Promise<boolean>
  create(data: object): Promise<T>
  delete(id: string | number): Promise<boolean>
}

export interface UserPublicInfo {
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

export class UserModel implements CRUDMode<UserPublicInfo> {
  async find(id: string | number): Promise<UserPublicInfo | null> {
    const res = await db
      .select()
      .from(user)
      .where(eq(user.id, id as string))

    if (!res.length) {
      return null
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

  async update(): Promise<boolean> {
    return true
  }

  async create(newUser: {
    id: string
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
    role: number
    avatar: string
  }): Promise<UserPublicInfo> {
    const salt = makeStr(8)
    const { id, email, phone, password, firstName, lastName, role, avatar } =
      newUser

    const data = {
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
    }

    const result = await db.insert(user).values(data)

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return {
      id,
      email,
      phone,
      firstName,
      lastName,
      avatar,
      role,
      createdOn: data.createdOn,
    } as UserPublicInfo
  }

  async delete(): Promise<boolean> {
    return true
  }
}

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

export class ProductModel implements CRUDMode<ProductPublicInfo> {
  async find(id: string): Promise<ProductPublicInfo | null> {
    const res = await db
      .select()
      .from(user)
      .where(eq(user.id, id as string))

    if (!res.length) {
      return null
    }

    const data: ProductPublicInfo = {
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

  async create(newUser: {
    id: string
    email: string
    phone: string
    password: string
    firstName: string
    lastName: string
    role: number
    avatar: string
  }): Promise<UserPublicInfo> {
    const salt = makeStr(8)
    const { id, email, phone, password, firstName, lastName, role, avatar } =
      newUser

    const data = {
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
    }

    const result = await db.insert(user).values(data)

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return {
      id,
      email,
      phone,
      firstName,
      lastName,
      avatar,
      role,
      createdOn: data.createdOn,
    } as UserPublicInfo
  }

  async delete(): Promise<boolean> {
    return true
  }
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

export class PublicInfo {
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
}
