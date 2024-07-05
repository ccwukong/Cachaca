import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import ProductCard from '~/themes/default/components/ui/ProductCard'
import { ProductPublicInfo, StoreSettings, CategoryItem } from '~/models'

const CategoryProductList = ({
  categories,
  storeSettings,
  products,
}: {
  categories: CategoryItem[]
  products: ProductPublicInfo[]
  storeSettings: StoreSettings
}) => {
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header storeLogo="" storeName="Cachaca" menuItems={categories} />

      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        <h2 className="mb-6 text-xl">Mens</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {products.map((item) => {
            return (
              <ProductCard
                key={item.id}
                coverImage={item.coverImage}
                title={item.name}
                link={`/products/${item.slug}`}
                price={`${storeSettings.currency.symbol}${item.basePrice}`}
              />
            )
          })}
        </div>
      </div>
      <Footer
        pageLinks={storeSettings.pageLinks}
        copyright={storeSettings.copyright}
      />
    </div>
  )
}

export default CategoryProductList
