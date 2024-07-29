/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link } from '@remix-run/react'
import { Menu, ShoppingCart, UserRound } from 'lucide-react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import StoreContext from '~/contexts/storeContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/themes/default/components/ui/accordion'
import { Badge } from '~/themes/default/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/themes/default/components/ui/hover-card'
import { Input } from '~/themes/default/components/ui/input'

const Header = ({
  cartItems,
  updateCartItemHandler,
  logoOnly = false,
}: {
  cartItems?: { [key: string]: string | number }[]
  updateCartItemHandler?: (id: string, quantity: number) => void
  logoOnly?: boolean
}) => {
  const { t } = useTranslation()
  const { storeSettings, categories } = useContext(StoreContext)
  const subtotal =
    cartItems && cartItems.length
      ? cartItems.reduce(
          (accu, item) => accu + Number(item.price) * Number(item.quantity),
          0,
        )
      : 0
  return (
    <nav className="left-0 bg-white w-full z-50 border-b border-slate-100 shadow-inner h-16 fixed p-0">
      <div className="items-center max-w-screen-xl mx-auto flex justify-between">
        <div className="ml-6 flex items-center justify-between py-3 md:py-3">
          <Link to="/">
            {storeSettings?.logo ? (
              <img
                src={storeSettings.logo}
                alt={storeSettings.name}
                className="object-cover max-h-12"
              />
            ) : (
              <h1 className="text-2xl font-bold">{storeSettings?.name}</h1>
            )}
          </Link>
        </div>

        {categories && (
          <div className="hidden pb-3 mt-8 md:pb-0 md:mt-0 md:flex-1 md:block">
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {categories
                .filter((item) => item.parentId === null)
                .map((item, idx) => (
                  <li key={item.id}>
                    <HoverCard openDelay={50} closeDelay={50}>
                      <HoverCardTrigger>
                        <Link to={`/categories/${item.slug}`}>{item.name}</Link>
                      </HoverCardTrigger>

                      <HoverCardContent className="flex justify-around">
                        {categories
                          .filter((sub) => sub.parentId === item.id)
                          .map((sub) => {
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
            <HoverCard openDelay={50} closeDelay={50}>
              <HoverCardTrigger className="flex">
                <Link to="/cart" className="flex justify-end font-bold">
                  <ShoppingCart className="mt-5 md:mt-0" />
                </Link>
                {cartItems && cartItems.length ? (
                  <Badge variant="destructive">{cartItems.length}</Badge>
                ) : null}
              </HoverCardTrigger>
              <HoverCardContent className="w-[400px]">
                {cartItems && cartItems.length ? (
                  cartItems.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="grid grid-cols-6 gap-2 py-1"
                      >
                        <div>
                          <img
                            src={item.coverImage as string}
                            className="h-16"
                            alt={item.name as string}
                          />
                        </div>
                        <div className="col-span-3">
                          <Link to={item.url as string} className="">
                            {item.name}
                          </Link>
                        </div>
                        <div>{`${storeSettings!.currency.symbol}${
                          Number(item.quantity) * Number(item.price)
                        }`}</div>
                        <div>
                          <Input
                            type="number"
                            value={item.quantity}
                            className="px-2 py-1 h-auto w-14"
                            onChange={(e) => {
                              updateCartItemHandler!(
                                item.id as string,
                                isNaN(parseInt(e.target.value, 10))
                                  ? 1
                                  : Math.ceil(Number(e.target.value)),
                              )
                            }}
                          />
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <span>{t('system.cart_empty')}</span>
                )}
                {cartItems && cartItems.length ? (
                  <>
                    <div className="flex justify-between mt-3">
                      <div className="font-bold">{t('system.subtotal')}</div>
                      <div>{`${
                        storeSettings!.currency.symbol
                      }${subtotal}`}</div>
                    </div>
                    <div className="mt-5">
                      <Link to="/cart" className="flex justify-end font-bold">
                        {t('system.go_to_cart')}
                      </Link>
                    </div>
                  </>
                ) : null}
              </HoverCardContent>
            </HoverCard>
          </div>
        )}

        <input type="checkbox" className="hidden toggle peer" id="check" />
        <label htmlFor="check" className="inline-block mr-6">
          <Menu size={36} className="cursor-pointer md:hidden" />
        </label>
        <div className="left-[-100%] peer-checked:left-0 transition-all duration-500 fixed top-16 h-screen w-[100%] z-50 bg-stone-200 bg-opacity-95 block md:hidden">
          {categories && (
            <ul className="justify-center items-center md:flex">
              {categories
                .filter((item) => item.parentId === null)
                .map((item, idx) => (
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
                        <AccordionContent>
                          {categories
                            .filter((sub) => sub.parentId === item.id)
                            .map((sub) => {
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

              <Link to="/cart" className="flex items-center">
                <ShoppingCart className="mt-5 md:mt-0" />
                {cartItems && cartItems.length ? (
                  <Badge variant="destructive">{cartItems.length}</Badge>
                ) : null}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
