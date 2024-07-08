/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link } from '@remix-run/react'
import { UserRound, ShoppingCart, Menu } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/themes/default/components/ui/hover-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/themes/default/components/ui/accordion'
import { CategoryItem } from '~/types'

const Header = ({
  storeLogo,
  storeName,
  menuItems,
  logoOnly = false,
}: {
  storeLogo: string
  storeName: string
  menuItems?: CategoryItem[]
  logoOnly?: boolean
}) => {
  return (
    <nav className="left-0 bg-white w-full z-50 border-b border-slate-100 shadow-inner h-16 fixed p-0">
      <div className="items-center max-w-screen-xl mx-auto flex justify-between">
        <div className="ml-6 flex items-center justify-between py-3 md:py-5">
          <Link to="/">
            {storeLogo ? (
              <img
                src={storeLogo}
                alt={storeName}
                className="object-cover h-18 w-32"
              />
            ) : (
              <h1 className="text-2xl font-bold">{storeName}</h1>
            )}
          </Link>
        </div>

        {menuItems && (
          <div className="hidden pb-3 mt-8 md:pb-0 md:mt-0 md:flex-1 md:block">
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {menuItems.map((item, idx) => (
                <li key={item.id}>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Link to={`/categories/${item.slug}`}>{item.name}</Link>
                    </HoverCardTrigger>
                    {item.subCategories && (
                      <HoverCardContent className="flex justify-around">
                        {item.subCategories.map((sub) => {
                          return (
                            <li
                              key={idx}
                              className="hover:text-indigo-600 inline-block"
                            >
                              <Link
                                to={`/categories/${item.slug}/s/${sub.slug}`}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          )
                        })}
                      </HoverCardContent>
                    )}
                  </HoverCard>
                </li>
              ))}
            </ul>
          </div>
        )}

        {logoOnly || (
          <div className="hidden md:flex justify-between items-center gap-4">
            <Link to="/account">
              <UserRound className="cursor-pointer" />
            </Link>
            <HoverCard>
              <HoverCardTrigger>
                <Link to="/cart">
                  <ShoppingCart className="mt-5 md:mt-0" />
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>Items</HoverCardContent>
            </HoverCard>
          </div>
        )}

        <input type="checkbox" className="hidden toggle peer" id="check" />
        <label htmlFor="check" className="inline-block mr-6">
          <Menu size={36} className="cursor-pointer md:hidden" />
        </label>
        <div className="left-[-100%] peer-checked:left-0 transition-all duration-500 fixed top-16 h-screen w-[100%] z-50 bg-stone-200 bg-opacity-95 block md:hidden">
          {menuItems && (
            <ul className="justify-center items-center md:flex">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="text-center">
                      <AccordionTrigger>
                        <div className="w-full">
                          <Link to={`/categories/${item.slug}`}>
                            {item.name}
                          </Link>
                        </div>
                      </AccordionTrigger>
                      {item.subCategories && (
                        <AccordionContent>
                          {item.subCategories.map((sub) => {
                            return (
                              <li key={idx} className="block py-2 text-lg">
                                <Link
                                  to={`/categories/${item.slug}/s/${sub.slug}`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            )
                          })}
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  </Accordion>
                </li>
              ))}
            </ul>
          )}
          {logoOnly || (
            <div className="flex flex-col items-center">
              <Link to="/account">
                <UserRound className="cursor-pointer" />
              </Link>
              <HoverCard>
                <HoverCardTrigger>
                  <Link to="/cart">
                    <ShoppingCart className="mt-5 md:mt-0" />
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent>Items</HoverCardContent>
              </HoverCard>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
