import {
  int,
  mysqlTable,
  tinyint,
  varchar,
  index,
  text,
  primaryKey,
} from 'drizzle-orm/mysql-core'

export const page = mysqlTable('page', {
  name: varchar('name', { length: 60 }).notNull().primaryKey(),
  slug: varchar('slug', { length: 60 }).notNull().unique(),
  content: text('content').notNull(),
  order: tinyint('order').notNull(),
  createdOn: int('created_on').notNull(),
  updatedOn: int('updated_on'),
  status: tinyint('status').notNull(),
})

export const user = mysqlTable(
  'user',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 120 }).notNull().unique(),
    phone: varchar('phone', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 32 }).notNull(),
    salt: varchar('salt', { length: 8 }).notNull(),
    firstName: varchar('first_name', { length: 30 }).notNull(),
    lastName: varchar('last_name', { length: 30 }).notNull(),
    avatar: varchar('avatar', { length: 255 }).notNull(),
    role: tinyint('role').notNull(),
    createdOn: int('created_on').notNull(),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
      phoneIdx: index('phone_idx').on(table.phone),
    }
  },
)

export const customer = mysqlTable(
  'customer',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 120 }).notNull(),
    phone: varchar('phone', { length: 50 }).notNull(),
    password: varchar('password', { length: 32 }).notNull(),
    salt: varchar('salt', { length: 8 }).notNull(),
    firstName: varchar('first_name', { length: 30 }).notNull(),
    lastName: varchar('last_name', { length: 30 }).notNull(),
    avatar: varchar('avatar', { length: 255 }).notNull(),
    createdOn: int('created_on').notNull(),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      emailIdx: index('email_idx').on(table.email),
      phoneIdx: index('phone_idx').on(table.phone),
    }
  },
)

export const customerAddress = mysqlTable(
  'customer_address',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    addressLine1: varchar('address_line_1', { length: 120 }),
    addressLine2: varchar('address_line_2', { length: 120 }),
    city: varchar('city', { length: 50 }),
    state: varchar('state', { length: 60 }),
    country: varchar('country', { length: 60 }),
    zipcode: varchar('zipcode', { length: 10 }),
    type: varchar('type', { length: 10 }).notNull(),
    createdOn: int('created_on').notNull(),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      customerIdIdx: index('customer_id_idx').on(table.customerId),
    }
  },
)

export const checkout = mysqlTable(
  'checkout',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    customerId: varchar('customer_id', { length: 36 }),
    currencyId: tinyint('currency_id').notNull(),
    createdOn: int('created_on').notNull(),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      customerIdIdx: index('customer_id_idx').on(table.customerId),
    }
  },
)

export const checkoutItem = mysqlTable(
  'checkout_item',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    checkoutId: varchar('checkout_id', { length: 36 }).notNull(),
    productVariantId: varchar('product_variant_id', { length: 36 }).notNull(),
    unitPrice: varchar('unit_price', { length: 20 }).notNull(),
    quantity: int('quantity').notNull(),
    createdOn: int('created_on').notNull(),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      checkoutIdIdx: index('checkout_id_idx').on(table.checkoutId),
      productVariantIdIdx: index('product_variant_id_idx').on(
        table.productVariantId,
      ),
    }
  },
)

export const shop = mysqlTable('shop', {
  name: varchar('name', { length: 120 }).notNull().primaryKey(),
  logo: varchar('logo', { length: 255 }).notNull(),
  email: varchar('email', { length: 60 }),
  phone: varchar('phone', { length: 30 }),
  addressLine1: varchar('address_line_1', { length: 120 }),
  addressLine2: varchar('address_line_2', { length: 120 }),
  city: varchar('city', { length: 50 }),
  state: varchar('state', { length: 60 }),
  country: varchar('country', { length: 60 }),
  zipcode: varchar('zipcode', { length: 10 }),
  baseCurrencyId: tinyint('base_currency_id').notNull(),
  description: varchar('description', { length: 500 }),
  createdBy: varchar('created_by', { length: 36 }).notNull(),
  createdOn: int('created_on').notNull(),
  updatedBy: varchar('updated_by', { length: 36 }),
  updatedOn: int('updated_on'),
  status: tinyint('status').notNull(),
})

export const currency = mysqlTable('currency', {
  id: tinyint('id').primaryKey(),
  code: varchar('code', { length: 3 }).notNull(),
  symbol: varchar('symbol', { length: 3 }).notNull(),
  name: varchar('name', { length: 30 }).notNull(),
  status: tinyint('status').notNull(),
})

export const product = mysqlTable(
  'product',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 120 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    coverImage: varchar('cover_image', { length: 255 }).notNull(),
    basePrice: varchar('base_price', { length: 20 }).notNull(),
    categoryId: varchar('category_id', { length: 36 }).notNull(),
    subCategoryId: varchar('subcategory_id', { length: 36 }).notNull(),
    createdBy: varchar('created_by', { length: 36 }).notNull(),
    createdOn: int('created_on').notNull(),
    updatedBy: varchar('updated_by', { length: 36 }),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
    /**
     * TODO: add the follwing status to allow disabling product temporarily instead of soft delete
     * disable: tinyint('disable').notNull(),
     */
  },
  (table) => {
    return {
      categoryIdIdx: index('cat_id_idx').on(table.categoryId),
    }
  },
)

export const productImage = mysqlTable(
  'product_image',
  {
    id: int('id').primaryKey().autoincrement(),
    url: varchar('url', { length: 255 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    metadata: varchar('metadata', { length: 500 }).notNull(),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      productIdIdx: index('product_id_idx').on(table.productId),
    }
  },
)

export const productCategory = mysqlTable('product_category', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  status: tinyint('status').notNull(),
})

export const productSubCategory = mysqlTable(
  'product_subcategory',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 60 }).notNull(),
    categoryId: varchar('category_id', { length: 36 }),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      categoryIdIdx: index('category_id_idx').on(table.categoryId),
    }
  },
)

export const collection = mysqlTable('collection', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  status: tinyint('status').notNull(),
})

export const collectionProduct = mysqlTable(
  'collection_product',
  {
    collectionId: varchar('collection_id', { length: 36 }),
    productId: varchar('product_id', { length: 36 }),
    name: varchar('name', { length: 60 }).notNull(),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.collectionId, table.productId] }),
    }
  },
)

// color, size, weight etc...
export const productVariantCategory = mysqlTable('product_variant_category', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 60 }).notNull(),
  status: tinyint('status').notNull(),
})

// not every product has variants
export const productVariant = mysqlTable(
  'product_variant',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 60 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    coverImage: varchar('cover_image', { length: 255 }).notNull(),
    productId: varchar('product_id', { length: 36 }).notNull(),
    //it could be negative or possitive based on the product base price
    priceVariant: varchar('price_variant', { length: 20 }).notNull(),
    sku: varchar('sku', { length: 36 }).notNull(),
    quantity: int('quantity').notNull(),
    variantCategoryId: int('variant_cat_id'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      productIdIdx: index('product_id_idx').on(table.productId),
      variantCategoryIdIdx: index('variant_cat_id_idx').on(
        table.variantCategoryId,
      ),
    }
  },
)

export const order = mysqlTable(
  'order',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    amount: varchar('amount', { length: 20 }).notNull(),
    checkoutId: varchar('checkout_id', { length: 36 }).notNull(),
    customerId: varchar('customer_id', { length: 36 }).notNull(),
    currencyId: tinyint('currency_id').notNull(),
    paymentStatus: varchar('payment_status', { length: 20 }).notNull(), // normalized data, reduce table join for better perf
    shippingStatus: varchar('shipping_status', { length: 20 }).notNull(), // normalized data, reduce table join for better perf
    shippingAddress: varchar('shipping_address', { length: 160 }).notNull(),
    billingAddress: varchar('billing_address', { length: 160 }).notNull(),
    shippingMethod: varchar('shipping_method', { length: 30 }).notNull(),
    shippingCost: varchar('shipping_cost', { length: 20 }).notNull(),
    tax: varchar('tax', { length: 20 }).notNull(),
    discount: varchar('discount', { length: 20 }).notNull(),
    note: varchar('note', { length: 250 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 20 }).notNull(),
    paymentScheme: varchar('payment_scheme', { length: 20 }).notNull(),
    paymentInstrument: varchar('payment_instrument', { length: 20 }).notNull(),
    paymentReference: varchar('payment_reference', { length: 60 }).notNull(),
    shippingReference: varchar('shipping_reference', { length: 60 }).notNull(),
    shippingTracking: varchar('shipping_tracking', { length: 60 }).notNull(),
    createdBy: varchar('created_by', { length: 36 }).notNull(), // customer ID
    createdOn: int('created_on').notNull(),
    updatedBy: varchar('updated_by', { length: 36 }),
    updatedOn: int('updated_on'),
    status: tinyint('status').notNull(),
  },
  (table) => {
    return {
      customerIdIdx: index('customer_id_idx').on(table.customerId),
      checkoutIdIdx: index('checkout_id_idx').on(table.checkoutId),
    }
  },
)
