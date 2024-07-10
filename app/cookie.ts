import { createCookie } from '@remix-run/node'

export const cookie = createCookie('_token', {
  httpOnly: true,
  maxAge: 60,
  path: '/',
  sameSite: 'lax',
  secrets: [process.env.SESSION_COOKIE_SECRET!], // TODO: throw an error if the secret is not set
  secure: (process.env.NODE_ENV || '') !== 'development',
})
