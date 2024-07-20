import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import StoreContext from '../storeContext'

describe('StoreContext', () => {
  it('should be defined', () => {
    expect(StoreContext).toBeDefined()
  })

  it('should return correct context value', async () => {
    const TestingComponent = () => {
      const { categories, storeSettings } = useContext(StoreContext)
      return (
        <div>
          <p>{storeSettings!.name}</p>
          <p>{categories[0].name}</p>
        </div>
      )
    }

    render(
      <StoreContext.Provider
        value={{
          categories: [{ id: 1, name: 'Men', slug: 'men' }],
          storeSettings: {
            name: 'test store',
            logo: 'https//',
            email: 'test@test.com',
            phone: '+1',
            address: null,
            description: 'test store',
            currency: { id: 1, name: 'US Dollar', code: 'USD', symbol: '$' },
            publicPages: [],
            other: null,
            banners: null,
          },
        }}
      >
        <TestingComponent />
      </StoreContext.Provider>,
    )

    expect(screen.getByText('Men')).toBeDefined()
    expect(screen.getByText('test store')).toBeDefined()
  })
})
