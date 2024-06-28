import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Cart from '~/themes/default/pages/shop/Cart'

export const meta: MetaFunction = () => {
  return [
    { title: 'Cart' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export const loader = async () => {
  return json([
    {
      coverImage:
        'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fHwy',
      title: 'test product 1',
      currency: '$',
      price: 39,
      quantity: 3,
    },
    {
      coverImage:
        'https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fHwy',
      title: 'test product 2',
      currency: '$',
      price: 29,
      quantity: 10,
    },
  ])
}

export default function Index() {
  const items = useLoaderData<typeof loader>()
  return <Cart items={items} />
}
