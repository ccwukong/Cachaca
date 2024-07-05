import { Trash2 } from 'lucide-react'
import { Input } from '~/themes/default/components/ui/input'

const CartItem = ({
  coverImage,
  title,
  currency,
  price,
  quantity,
}: {
  coverImage: string
  title: string
  currency: string
  price: number
  quantity: number
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 border border-slate-100 rounded py-3 px-6 shadow-md mb-6">
      <div>
        <img
          src={coverImage}
          alt={title}
          className="object-cover w-28 h-36 rounded"
        />
      </div>
      <div className="md:cols-span-2">
        <div className="text-xl font-light font-weight-300">{title}</div>
        <div className="flex items-center space-x-3 mt-3">
          <div>Quantity:</div>{' '}
          <Input
            type="number"
            value={quantity}
            className="px-2 py-1 h-auto w-14"
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div className="text-xl text-black ">{`${currency} ${
          price * quantity
        }`}</div>
        <Trash2 className="cursor-pointer" />
      </div>
    </div>
  )
}

export default CartItem
