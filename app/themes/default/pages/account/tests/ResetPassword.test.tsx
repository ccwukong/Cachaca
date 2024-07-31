import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import CustomerContext from '~/contexts/customerContext'
import ResetPassword from '~/themes/default/pages/account/ResetPassword'
import { Role, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

describe('ResetPassword page component', () => {
  test('Testing ResetPassword page component rendering', async () => {
    const routes = [
      {
        path: '*',
        element: (
          <CustomerContext.Provider
            value={{
              storeSettings: (await mocks.getStoreInfo()) as StoreSettings,
              account: {
                id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'XXXXXXXXXXXXX',
                phone: 'XXXXXXXXXXXXX',
                avatar: 'XXXXXXXXXXXXX',
                role: Role.Customer,
              },
            }}
          >
            <ResetPassword email="test@test.com" />
          </CustomerContext.Provider>
        ),
      },
    ]

    const router = createMemoryRouter(routes)

    render(<RouterProvider router={router} />)

    expect(screen.getByDisplayValue('test@test.com')).toBeDefined()
  })
})
