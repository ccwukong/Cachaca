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

export interface MenuItem {
  title: string
  path: string
}

const Header = ({
  storeLogo,
  storeName,
  menuItems,
  logoOnly = false,
}: {
  storeLogo: string
  storeName: string
  menuItems?: MenuItem[]
  logoOnly?: boolean
}) => {
  return (
    <nav className="left-0 bg-white w-full z-50 border-b border-slate-50 shadow-sm fixed">
      <div className="items-center max-w-screen-xl mx-auto flex justify-between p-0">
        <div className="ml-6 flex items-center justify-between py-3 md:py-5">
          <Link to="/">
            {storeLogo ? (
              <img
                src={storeLogo}
                alt={storeName}
                className="object-cover h-18 w-32"
              />
            ) : (
              <h1 className="text-2xl font-bold text-purple-600">
                {storeName}
              </h1>
            )}
          </Link>
        </div>

        {menuItems && (
          <div className="hidden pb-3 mt-8 md:pb-0 md:mt-0 md:flex-1 md:block">
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {menuItems.map((item, idx) => (
                <li key={item.title}>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Link to={item.path}>{item.title}</Link>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <li key={idx} className="hover:text-indigo-600">
                        <Link to={item.path}>{item.title}</Link>
                      </li>
                    </HoverCardContent>
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
        <div className="left-[-100%] peer-checked:left-0 transition-all duration-250 fixed top-[8%] h-screen w-[100%] z-50 bg-stone-200 bg-opacity-95 block md:hidden">
          {menuItems && (
            <ul className="justify-center items-center md:flex">
              {menuItems.map((item, idx) => (
                <li key={item.title}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="text-center">
                      <AccordionTrigger>
                        <div className="w-full">
                          <Link to={item.path}>{item.title}</Link>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Link to={item.path}>{item.title}</Link>
                      </AccordionContent>
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
