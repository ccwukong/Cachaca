import jwt, { JwtPayload } from 'jsonwebtoken'

export const encode = async (
  expiresIn: string,
  data: {
    id: string
    firstName: string
    lastName: string
    email: string
  },
  secret: string,
) => {
  const { id, firstName, lastName, email } = data
  return jwt.sign(
    {
      id,
      firstName,
      lastName,
      email,
    },
    secret,
    { expiresIn },
  )
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
