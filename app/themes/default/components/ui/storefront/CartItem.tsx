import { Link } from '@remix-run/react'
import { Trash2 } from 'lucide-react'
import { Input } from '~/themes/default/components/ui/input'

const CartItem = ({
  id,
  slug,
  coverImage,
  title,
  currency,
  price,
  quantity,
  updateCartItemHandler,
}: {
  id: string
  slug: string
  coverImage: string
  title: string
  currency: string
  price: string
  quantity: number
  updateCartItemHandler: (id: string, quantity: number) => void
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded md:py-3 md:px-6 shadow-md mb-6">
      <div>
        <img
          src={coverImage}
          alt={title}
          className="object-cover w-full h-76 md:w-28 md:h-36 rounded"
        />
      </div>
      <div className="p-3 md:p-0 md:cols-span-2">
        <div className="text-xl font-light font-weight-300">
          <Link to={`/products/${slug}`}>{title}</Link>
        </div>
        <div className="flex items-center space-x-3 mt-3">
          <div>Quantity:</div>
          <Input
            type="number"
            value={quantity}
            className="px-2 py-1 h-auto w-14"
            onChange={(e) => {
              updateCartItemHandler(
                id,
                isNaN(parseInt(e.target.value, 10))
                  ? 1
                  : Math.ceil(Number(e.target.value)),
              )
            }}
          />
        </div>
      </div>
      <div className="p-3 md:p-0 flex mt-3 md:mt-0 md:flex-col justify-between items-end">
        <div className="text-xl text-black ">{`${currency}${
          Number(price) * Number(quantity)
        }`}</div>
        <Trash2
          className="cursor-pointer"
          data-testid={`delete-${id}`}
          onClick={() => updateCartItemHandler(id, 0)}
        />
      </div>
    </div>
  )
}

export default CartItem
