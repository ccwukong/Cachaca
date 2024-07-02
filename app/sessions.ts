import { createCookieSessionStorage } from '@remix-run/node'

type SessionData = {
  userId: string
  accessToken: string
  refreshToken: string
}

type SessionFlashData = {
  error: string
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 60,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_COOKIE_SECRET!],
      secure: true,
    },
  })

export { getSession, commitSession, destroySession }
