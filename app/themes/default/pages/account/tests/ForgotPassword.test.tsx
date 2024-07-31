import { render, screen } from '@testing-library/react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CustomerContext from '~/contexts/customerContext'
import ForgotPassword from '~/themes/default/pages/account/ForgotPassword'
import { Role, StoreSettings } from '~/types'
import * as mocks from '~/utils/mocks'

describe('ForgotPassword page component', () => {
  test('Testing ForgotPassword page component rendering', async () => {
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
            <ForgotPassword />
          </CustomerContext.Provider>
        ),
      },
    ]

    const router = createBrowserRouter(routes)

    render(<RouterProvider router={router} />)

    expect(
      screen.getByText('system.check_forgot_password_email_link'),
    ).toBeDefined()
  })
})
