import type { MetaFunction } from '@remix-run/node'
import CategoryProductList from '~/themes/default/pages/shop/CategoryProductList'

export const meta: MetaFunction = () => {
  return [
    { title: 'Product 123' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export default function Index() {
  return <CategoryProductList />
}
