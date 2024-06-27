import type { MetaFunction } from '@remix-run/node'
import ProductDetail from '~/themes/default/pages/ProductDetail'

export const meta: MetaFunction = () => {
  return [
    { title: 'Product 123' },
    { name: 'description', content: 'Test product promotion' },
  ]
}

export default function Index() {
  return <ProductDetail />
}
