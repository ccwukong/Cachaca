import { redirect } from '@remix-run/node'
import { adminCookie } from '~/cookie'

export const loader = async () => {
  return redirect('/', {
    headers: {
      'Set-Cookie': await adminCookie.serialize('', {
        maxAge: 1,
      }),
    },
  })
}
