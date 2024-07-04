import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import ProductCard from '~/themes/default/components/ui/ProductCard'
import { ProductPublicInfo } from '~/model'

const CategoryProductList = ({
  products,
}: {
  products: ProductPublicInfo[]
}) => {
  return (
    <div className="mx-6 overflow-hidden lg:mx-0">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={[
          { title: 'Men', path: '/categories/men' },
          { title: 'Women', path: '/categories/women' },
          { title: 'Accessories', path: '/categories/accessories' },
        ]}
      />

      <div className="max-w-screen-xl mx-auto h-auto pt-28">
        <h2 className="mb-6 text-xl">Mens</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {products.map((item) => {
            return (
              <ProductCard
                key={item.id}
                coverImage={item.coverImage}
                title={item.name}
                link={`/products/${item.slug}`}
                price={`${item.currency.symbol}${item.basePrice}`}
              />
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CategoryProductList
