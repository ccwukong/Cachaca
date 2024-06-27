import { useTranslation } from 'react-i18next'
import Layout from '~/themes/default/Layout'
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

const ProductDetail = () => {
  const { t } = useTranslation()
  return (
    <Layout
      header={
        <Header
          storeLogo=""
          storeName="Cachaca"
          menuItems={[
            { title: 'Men', path: '/men' },
            { title: 'Women', path: '/women' },
            { title: 'Accessories', path: '/accessories' },
          ]}
        />
      }
      content={
        <div className="max-w-screen-xl mx-auto h-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-2">
              <img
                src="https://images.unsplash.com/photo-1611930021698-a55ec4d5fe6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                alt="Test product cover"
                className="object-cover w-full h-76"
              />
              <img
                src="https://images.unsplash.com/photo-1620917669809-1af0497965de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                alt="Test product cover"
                className="object-cover w-full h-76"
              />
              <img
                src="https://images.unsplash.com/photo-1617027185542-e87f1bce9091?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                alt="Test product cover"
                className="object-cover w-full h-76"
              />
              <img
                src="https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                alt="Test product cover"
                className="object-cover w-full h-76"
              />
            </div>
            <div className="md:col-span-2">
              <p className="text-xl font-light">Test product</p>
              <p className="text-2xl mt-5">$129</p>
              <p className="mt-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                tristique mauris dui, eu mollis diam congue non. Nam aliquet
                tempor nisl vel gravida. Donec posuere fringilla ex ac dictum.
                Nullam tempor nunc eget tempor finibus. Sed sodales dui id felis
                gravida placerat. Duis faucibus quam id facilisis venenatis.
                Integer eget nibh quis tortor porta efficitur. Quisque vitae leo
                aliquam, pulvinar ipsum at, suscipit odio. Etiam pretium <br />
                <br />
                tincidunt venenatis. Duis ornare, velit eget rhoncus tincidunt,
                purus sapien suscipit ante, vulputate scelerisque nunc velit id
                eros. Aliquam erat volutpat. Mauris sollicitudin ipsum eget
                nulla eleifend, malesuada dignissim nisi tempor. Integer eget
                nisi ut dolor molestie ornare sed eu quam. Mauris vitae interdum
                lectus. Suspendisse a dapibus nisl, at euismod odio. Vestibulum
                justo quam, posuere et dui a, dignissim auctor velit. Nulla
                dictum laoreet malesuada. Aenean vitae est eget ante efficitur
                semper ac vel quam. Nullam tempus tincidunt nibh, in luctus
              </p>
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
        </div>
      }
      footer={<Footer />}
    />
  )
}

export default ProductDetail
