import { encode, isValid, decode } from '~/utils/jwt'

// jest.useFakeTimers()

describe('Test JWT untility functions', () => {
  it('Decode and validate the token', async () => {
    const token = await encode(
      '1m',
      {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      'secret',
    )
    expect(await isValid(token, 'secret')).toBe(true)
    const data = (await decode(token, 'secret')) as {
      id: string
      firstName: string
      lastName: string
      email: string
    }

    expect(data.id).toBe('123')
  })

  it('Validation failed when token is expired', async () => {
    const token = await encode(
      '1s',
      {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      'secret',
    )

    const sleep = () => {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve('sleep')
        }, 1006),
      )
    }

    await sleep()

    expect(await isValid(token, 'secret')).toBe(false)
  })
})
