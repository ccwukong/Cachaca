/**
 * The models WILL NOT handle the exceptions
 */

import { eq, desc } from 'drizzle-orm'
import md5 from 'md5'
import { user, shop } from '../db/schema'
import db from '../db/connection'
import { makeStr } from '~/utils/string'
import { ServerInternalError } from '~/utils/exception'
import {
  UserPublicInfo,
  ProductPublicInfo,
  HomeBannerSettings,
  StoreSettings,
  Role,
} from '~/types'

interface CRUDMode<T> {
  find(id: string | number): Promise<T | null>
  findMany(page: number, size: number): Promise<T[]>
  update(id: string | number, data: object): Promise<boolean>
  create(data: object): Promise<T>
  delete(id: string | number): Promise<boolean>
}

export class Installer {
  public static async create(data: {
    name: string
    description: string
    createdBy: string
    logo?: string
    email?: string
    phone?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    country?: string
    zipcode?: string
    baseCurrencyId?: number
  }): Promise<boolean> {
    const result = await db.insert(shop).values({
      name: data.name,
      logo: data.logo ?? '',
      email: data.email ?? '',
      phone: data.phone ?? '',
      addressLine1: data.addressLine1 ?? '',
      addressLine2: data.addressLine2 ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      country: data.country ?? '',
      zipcode: data.zipcode ?? '',
      baseCurrencyId: data.baseCurrencyId ?? 1,
      description: data.description,
      createdBy: data.createdBy,
      createdOn: Math.floor(Date.now() / 1000),
      status: 1,
    })

    if (!result[0].affectedRows) {
      throw new ServerInternalError()
    }

    return true
  }
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
    role: Role
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

// export class ProductModel implements CRUDMode<ProductPublicInfo> {
//   async find(id: string): Promise<ProductPublicInfo | null> {
//     const res = await db
//       .select()
//       .from(user)
//       .where(eq(user.id, id as string))

//     if (!res.length) {
//       return null
//     }

//     const data: ProductPublicInfo = {
//       id: id as string,
//       email: res[0].email,
//       phone: res[0].phone,
//       firstName: res[0].firstName,
//       lastName: res[0].lastName,
//       avatar: res[0].avatar,
//       role: res[0].role,
//       createdOn: res[0].createdOn,
//       updatedOn: res[0].updatedOn || undefined,
//     }

//     return data
//   }

//   async findMany(page: number, size: number): Promise<ProductPublicInfo[]> {
//     const res = await db
//       .select()
//       .from(user)
//       .orderBy(desc(user.createdOn))
//       .limit(size)
//       .offset(page * size)

//     return res.map((item) => {
//       return {
//         id: item.id,
//         email: item.email,
//         phone: item.phone,
//         firstName: item.firstName,
//         lastName: item.lastName,
//         avatar: item.avatar,
//         role: item.role,
//         createdOn: item.createdOn,
//         updatedOn: item.updatedOn || undefined,
//       }
//     })
//   }

//   async update(): Promise<boolean> {
//     return true
//   }

//   async create(newUser: {
//     id: string
//     email: string
//     phone: string
//     password: string
//     firstName: string
//     lastName: string
//     role: number
//     avatar: string
//   }): Promise<UserPublicInfo> {
//     const salt = makeStr(8)
//     const { id, email, phone, password, firstName, lastName, role, avatar } =
//       newUser

//     const data = {
//       id,
//       email,
//       phone,
//       password: md5(password + salt),
//       salt,
//       firstName,
//       lastName,
//       avatar,
//       role,
//       createdOn: Math.floor(Date.now() / 1000),
//       status: 1,
//     }

//     const result = await db.insert(user).values(data)

//     if (!result[0].affectedRows) {
//       throw new ServerInternalError()
//     }

//     return {
//       id,
//       email,
//       phone,
//       firstName,
//       lastName,
//       avatar,
//       role,
//       createdOn: data.createdOn,
//     } as UserPublicInfo
//   }

//   async delete(): Promise<boolean> {
//     return true
//   }
// }

// export class PublicInfo {
//   public static async getHomeBanners(): Promise<HomeBannerSettings> {
//     return {
//       autoplay: banners.autoplay,
//       speed: banners.speed,
//       bannerItems: banners.items,
//     }
//   }

//   public static async getStoreInfo(): Promise<StoreSettings> {
//     return {
//       name: settings.name,
//       logo: settings.logo,
//       description: settings.description,
//       currency: settings.currency,
//       pageLinks: settings.pageLinks,
//       copyright: settings.copyright,
//     }
//   }
// }
