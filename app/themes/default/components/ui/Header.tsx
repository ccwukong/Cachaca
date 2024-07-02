/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'
import { Link } from '@remix-run/react'
import { UserRound, ShoppingCart, Menu } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/themes/default/components/ui/hover-card'

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
    <nav className="bg-white w-full border-b md:border-0">
      <div className="items-center max-w-screen-xl mx-auto md:flex">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link to="/">
            <h1 className="text-3xl font-bold text-purple-600">
              {storeLogo ? (
                <img
                  src={storeLogo}
                  alt={storeName}
                  className="object-cover h-18 w-32"
                />
              ) : (
                storeName
              )}
            </h1>
          </Link>

          <input type="checkbox" className="hidden" id="check" />
          <label htmlFor="check">
            <Menu size={36} className="cursor-pointer" />
          </label>
        </div>

        {menuItems && (
          <div className="flex-1 justify-self-center pb-3 mt-8 md:pb-0 md:mt-0 md:block">
            <ul className="left-[100%] justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
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
          <div className="md:flex justify-between w-16">
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
    </nav>
  )
}

export default Header
