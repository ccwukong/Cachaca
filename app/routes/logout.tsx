import { redirect } from '@remix-run/node'
import { cookie } from '~/cookie'

export const loader = async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': await cookie.serialize('', {
        maxAge: 1,
      }),
    },
  })
}
