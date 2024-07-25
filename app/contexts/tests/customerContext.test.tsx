import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import { DatabaseRecordStatus } from '~/types'
import CustomerContext from '../customerContext'

describe('CustomerContext', () => {
  it('should be defined', () => {
    expect(CustomerContext).toBeDefined()
  })

  it('should return correct context value', async () => {
    const TestingComponent = () => {
      const { account, storeSettings } = useContext(CustomerContext)
      return (
        <div>
          <p>{storeSettings!.name}</p>
          <p>{`${account!.firstName} ${account!.lastName}`}</p>
          <p>{account!.email}</p>
        </div>
      )
    }

    render(
      <CustomerContext.Provider
        value={{
          account: {
            id: 'XXXXXXXXXX',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@test.com',
            phone: '+1',
            avatar: 'https//',
            createdOn: 1,
            updatedOn: null,
            status: DatabaseRecordStatus.Active,
          },
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
      </CustomerContext.Provider>,
    )

    expect(screen.getByText('John Doe')).toBeDefined()
    expect(screen.getByText('john.doe@test.com')).toBeDefined()
    expect(screen.getByText('test store')).toBeDefined()
  })
})
