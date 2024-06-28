import { useState } from 'react'
import { Link } from '@remix-run/react'
import { UserRound, ShoppingCart, Menu } from 'lucide-react'

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
  const [state, setState] = useState(false)
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
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        {menuItems && (
          <div className="flex-1 justify-self-center pb-3 mt-8 md:pb-0 md:mt-0 md:block">
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {menuItems.map((item, idx) => (
                <li key={idx} className="hover:text-indigo-600">
                  <Link to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {logoOnly || (
          <div className="md:flex justify-between w-16">
            <UserRound className="cursor-pointer" />
            <Link to="/cart">
              <ShoppingCart className="mt-5 md:mt-0" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
