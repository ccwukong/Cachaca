import { redirect, type MetaFunction } from '@remix-run/node'
import { cookie } from '~/cookie'

export const meta: MetaFunction = () => {
  return [{ title: 'My Acccount - Orders' }]
}

export const loader = async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': await cookie.serialize('', {
        maxAge: 1,
      }),
    },
  })
}
