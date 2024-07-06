import products from '../../mockdata/products.json'
import banners from '../../mockdata/banners.json'
import settings from '../../mockdata/site_settings.json'
import cart from '../../mockdata/cart.json'
import categories from '../../mockdata/categories.json'
import orders from '../../mockdata/orders.json'

export function getMockProductById(id: string) {
  const item = products.find((item) => item.id === id || item.slug === id)
  if (item) {
    return Promise.resolve({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      basePrice: item.basePrice,
      coverImage: item.coverImage,
      categoryId: item.categoryId,
      subCategoryId: item.subCategoryId,
      images: item.images,
    })
  } else {
    return Promise.resolve(null)
  }
}

export function getMockProducts(): Promise<object[]> {
  return new Promise((resolve) => {
    resolve(
      products.map((item) => {
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          basePrice: item.basePrice,
          coverImage: item.coverImage,
          categoryId: item.categoryId,
          subCategoryId: item.subCategoryId,
          images: item.images,
        }
      }),
    )
  })
}

export function getHomeBanners(): Promise<object> {
  return new Promise((resolve) =>
    resolve({
      autoplay: banners.autoplay,
      speed: banners.speed,
      bannerItems: banners.items,
    }),
  )
}

export function getStoreInfo(): Promise<object> {
  return new Promise((resolve) =>
    resolve({
      name: settings.name,
      logo: settings.logo,
      description: settings.description,
      currency: settings.currency,
      pageLinks: settings.pageLinks,
      copyright: settings.copyright,
    }),
  )
}

export function getCart(): Promise<object[]> {
  return new Promise((resolve) =>
    resolve(
      cart.map((item) => {
        return {
          title: item.title,
          slug: item.slug,
          coverImage: item.coverImage,
          price: item.price,
          quantity: item.quantity,
        }
      }),
    ),
  )
}

export function getCategories(): Promise<object[]> {
  return new Promise((resolve) =>
    resolve(
      categories.map((item) => {
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          subCategories: item.subCategories,
        }
      }),
    ),
  )
}

export function getOrders(): Promise<object[]> {
  return new Promise((resolve) => resolve(orders))
}
