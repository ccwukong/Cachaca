import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/themes/default/components/ui/carousel'
import Header from '~/themes/default/components/ui/Header'
import Footer from '~/themes/default/components/ui/Footer'
import ProductCard from '~/themes/default/components/ui/ProductCard'
import StoreLayout from '~/themes/default/StoreLayout'

const Home = () => {
  return (
    <StoreLayout
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
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
          >
            <CarouselContent>
              <CarouselItem>
                <img
                  src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                  alt="iPhone"
                  className="object-cover w-full h-96"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://images.unsplash.com/photo-1626807236036-9cf12909b45a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                  alt="promotion"
                  className="object-cover w-full h-96"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://images.unsplash.com/photo-1599360889420-da1afaba9edc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
                  alt="Tesla"
                  className="object-cover w-full h-96"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <h2 className="mt-16 mb-6 text-xl">Products</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1611930021698-a55ec4d5fe6e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
              title="Test product"
              price="$12.59"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1620917669809-1af0497965de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
              title="Test product 2"
              price="$18"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1617027185542-e87f1bce9091?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
              title="Test product 3"
              price="$32.95"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDI%3D"
              title="Test product 4"
              price="$12"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1614806686974-4d53169a47cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE3fHxwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDI%3D"
              title="Test product 5"
              price="$9.59"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1608611507529-9e94843ca341?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA1fHxwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDI%3D"
              title="Test product 6"
              price="$69"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1618354691249-18772bbac3a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODh8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
              title="Test product 7"
              price="$120.99"
            />
            <ProductCard
              coverImage="https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8Mg%3D%3D"
              title="Test product 8"
              price="$12"
            />
          </div>
        </div>
      }
      footer={<Footer />}
    />
  )
}

export default Home
