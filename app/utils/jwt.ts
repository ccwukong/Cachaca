import jwt, { JwtPayload } from 'jsonwebtoken'

export const encode = async (
  expiresIn: string,
  data: {
    id: string
    firstName: string
    lastName: string
    email: string
  },
) => {
  const { id, firstName, lastName, email } = data
  return jwt.sign(
    {
      id,
      firstName,
      lastName,
      email,
    },
    process.env.JWT_TOKEN_SECRET || '', // TODO: throw an error if the secret is not set
    { expiresIn },
  )
}

export const isValid = async (token: string) => {
  try {
    const { exp } = (await jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET || '',
    )) as JwtPayload

    if ((exp ?? 0) <= Math.floor(Date.now() / 1000)) {
      return false
    } else {
      return true
    }
  } catch (e) {
    return false
  }
}

export const decode = async (token: string) => {
  return await jwt.verify(token, process.env.JWT_TOKEN_SECRET || '')
}
