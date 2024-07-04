import { useTranslation } from 'react-i18next'
import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/themes/default/components/ui/select'
import { Button } from '~/themes/default/components/ui/button'
import { ProductPublicInfo, StoreSettings } from '~/model'

const ProductDetail = ({
  storeSettings,
  product,
}: {
  product: ProductPublicInfo | null
  storeSettings: StoreSettings
}) => {
  const { t } = useTranslation()
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
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-2">
              {product.images.map((item, idx) => {
                return (
                  <img
                    key={idx}
                    src={item}
                    alt={product.name}
                    className="object-cover w-full h-76"
                  />
                )
              })}
            </div>
            <div className="md:col-span-2">
              <p className="text-xl font-light">{product.name}</p>
              <p className="text-2xl mt-5">{`${product.currency.symbol}${product.basePrice}`}</p>
              <p
                className="mt-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              <p className="text-lg mt-6">Size</p>
              <div className="mt-3">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-lg mt-6">Color</p>
              <div className="mt-3">
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White (+$10)</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="secondary" className="w-full mt-10">
                {t('add_cart')}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer
        pageLinks={storeSettings.pageLinks}
        copyright={storeSettings.copyright}
      />
    </div>
  )
}

export default ProductDetail
