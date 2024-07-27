import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import StoreContext from '../storeContext'
import { DatabaseRecordStatus } from '~/types'

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
          categories: [{ id: '1', name: 'Men', slug: 'men', parentId: null }],
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
          account: {
            id: '123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
            phone: '1234567890',
            avatar: 'https://',
            updatedOn: null,
            status: DatabaseRecordStatus.Active,
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
