import jwt, { JwtPayload } from 'jsonwebtoken'
import { Role } from '~/types'

export const encode = async (
  expiresIn: string,
  data: {
    id: string
    firstName: string
    lastName: string
    email: string
    role?: Role
  },
  secret: string,
) => {
  const { id, firstName, lastName, email, role } = data
  const payload: {
    [key: string]: string | number
  } = {
    id,
    firstName,
    lastName,
    email,
  }

  if (role) {
    payload.role = role
  }

  return jwt.sign(payload, secret, { expiresIn })
}

export const isValid = async (token: string, secret: string) => {
  try {
    const { exp } = (await jwt.verify(token, secret)) as JwtPayload

    if ((exp ?? 0) <= Math.floor(Date.now() / 1000)) {
      return false
    } else {
      return true
    }
  } catch (e) {
    return false
  }
}

export const decode = async (token: string, secret: string) => {
  return await jwt.verify(token, secret)
}
