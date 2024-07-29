import { render, screen } from '@testing-library/react'
import { useContext } from 'react'
import AdminContext from '../adminContext'

describe('AdminContext', () => {
  it('should be defined', () => {
    expect(AdminContext).toBeDefined()
  })

  it('should return correct context value', async () => {
    const TestingComponent = () => {
      const { navItems, storeSettings } = useContext(AdminContext)
      return (
        <div>
          <p>{storeSettings!.name}</p>
          <p>{navItems[0].title}</p>
        </div>
      )
    }

    render(
      <AdminContext.Provider
        value={{
          navItems: [{ title: 'test link', url: '/', order: 1 }],
          account: null,
          storeSettings: {
            name: 'test store',
            logo: 'https//',
            email: 'test@test.com',
            phone: '+1',
            address: null,
            description: 'test store',
            currency: { id: 1, name: 'US Dollar', code: 'USD', symbol: '$' },
            other: null,
            banners: null,
          },
        }}
      >
        <TestingComponent />
      </AdminContext.Provider>,
    )

    expect(screen.getByText('test store')).toBeDefined()
    expect(screen.getByText('test link')).toBeDefined()
  })
})
