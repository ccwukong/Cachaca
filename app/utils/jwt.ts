import jwt, { JwtPayload } from 'jsonwebtoken'

export const encode = async ({
  id,
  firstName,
  lastName,
  email,
}: {
  id: string
  firstName: string
  lastName: string
  email: string
}) => {
  return [
    jwt.sign(
      {
        id,
        firstName,
        lastName,
        email,
      },
      process.env.JWT_TOKEN_SECRET as string, // TODO: throw an error if the secret is not set
      { expiresIn: '1h' },
    ),
    jwt.sign(
      {
        id,
        firstName,
        lastName,
        email,
      },
      process.env.JWT_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    ),
  ]
}

export const isValid = async (token: string) => {
  const { exp } = (await jwt.verify(
    token,
    process.env.JWT_TOKEN_SECRET || '',
  )) as JwtPayload

  if (exp! <= Math.floor(Date.now() / 1000)) {
    return false
  } else {
    return true
  }
}

export const decode = async (token: string) => {
  return await jwt.verify(token, process.env.JWT_TOKEN_SECRET || '')
}
