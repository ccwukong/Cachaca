import {
  json,
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Installer } from '~/models'
import Settings from '~/themes/default/pages/account/Settings'

export const meta: MetaFunction = () => {
  return [{ title: 'My Account - Settings' }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!(await Installer.isInstalled())) {
    return redirect('/install')
  }

  const cookieStr = request.headers.get('Cookie') || ''
  if (!cookieStr) {
    return redirect('/login')
  }

  return json({ successful: true })
}

export default function Index() {
  return <Settings storeLogo="" storeName="Cachaca" />
}
