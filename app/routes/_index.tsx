import type { MetaFunction } from '@remix-run/node'
import Home from '~/themes/default/pages/Home'

export const meta: MetaFunction = () => {
  return [
    { title: 'Cachaca' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export default function Index() {
  return <Home />
}
