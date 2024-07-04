import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/themes/default/components/ui/carousel'
import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import ProductCard from '~/themes/default/components/ui/ProductCard'
import { ProductPublicInfo, HomeBannerSetting } from '~/model'

const Home = ({
  banners,
  products,
}: {
  banners: HomeBannerSetting
  products: ProductPublicInfo[]
}) => {
  return (
    <div className="mx-6 overflow-hidden">
      <Header
        storeLogo=""
        storeName="Cachaca"
        menuItems={[
          { title: 'Men', path: '/categories/men' },
          { title: 'Women', path: '/categories/women' },
          { title: 'Accessories', path: '/categories/accessories' },
        ]}
      />

      <div className="max-w-screen-xl mx-auto h-auto pt-24">
        <Carousel
          plugins={
            banners.autoplay
              ? [
                  Autoplay({
                    delay: banners.speed,
                  }),
                ]
              : []
          }
        >
          <CarouselContent>
            {banners.bannerItems.map((item, idx) => {
              return (
                <CarouselItem key={idx}>
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    className="object-cover w-full h-96"
                  />
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
        <h2 className="mt-16 mb-6 text-xl">Products</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {products.map((item) => {
            return (
              <ProductCard
                key={item.id}
                coverImage={item.coverImage}
                title={item.name}
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

export default Home
